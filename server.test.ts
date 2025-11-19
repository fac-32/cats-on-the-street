import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server.js'; // Adjust path if your file is named differently

describe('Cats API Endpoints', () => {
  it('GET /cats - should return all cat names', async () => {
    const response = await request(app).get('/cats');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // initially before creating Swagger.test.ts file, the test below was using /cat/:id endpoint
  it('GET /cats/:id - should return cat details if found', async () => {
    const response = await request(app).get('/cats/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('location');
  });

  // initially before creating Swagger.test.ts file, the test below was using /cat/:id endpoint
  it('GET /cats/:id - should return 404 if cat not found', async () => {
    const response = await request(app).get('/cats/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Cat not found');
  });

  it('POST /cats - should create a new cat', async () => {
    const newCat = {
      name: 'Snowball',
      description: 'White Persian',
      location: 'Notting Hill',
    };
    const response = await request(app).post('/cats').send(newCat);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newCat);
    expect(response.body).toHaveProperty('id');
  });

  it('POST /cats - should return 400 if required fields missing', async () => {
    const response = await request(app).post('/cats').send({ name: 'NoDesc' });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Required information omitted');
  });

  it('DELETE /cats/:id - should delete a cat', async () => {
    // First create a cat to delete
    const createRes = await request(app).post('/cats').send({
      name: 'ToDelete',
      description: 'Temporary Cat',
      location: 'Nowhere',
    });
    const idToDelete = createRes.body.id;

    // Delete the cat
    const deleteRes = await request(app).delete(`/cats/${idToDelete}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toHaveProperty('message', 'Cat deleted');
  });

  it('PUT /cats/:id - should update cat description', async () => {
    const newDescription = 'Updated Description';

    const response = await request(app)
      .put('/cats/1')
      .send({ description: newDescription });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('description', newDescription);
  });

  it('PUT /cats/:id - should return 404 if cat not found', async () => {
    const response = await request(app)
      .put('/cats/9999')
      .send({ description: 'Does not exist' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Cat not found');
  });
});
