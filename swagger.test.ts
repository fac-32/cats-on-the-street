import { describe, expect, it } from "vitest";
import request from 'supertest';
import app from "./server.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Swagger/OpenAPI Definition", () => {
  it("should be a valid OpenAPI 3.0.3 specification", () => {
    const swaggerJsonPath = path.resolve(__dirname, "./swagger.json");
    const swaggerJsonContent = fs.readFileSync(swaggerJsonPath, "utf-8");
    const swaggerDef = JSON.parse(swaggerJsonContent);

    // Check for OpenAPI version
    expect(swaggerDef.openapi).toBe("3.0.3");

    // Check for info block
    expect(swaggerDef.info).toBeDefined();
    expect(swaggerDef.info.title).toBe("Cats on the Street API");
    expect(swaggerDef.info.version).toBe("1.0.0");
    expect(swaggerDef.info.description).toBeDefined();

    // Check for paths
    expect(swaggerDef.paths).toBeDefined();
    expect(Object.keys(swaggerDef.paths).length).toBeGreaterThan(0);
  });
});

describe('Cats on the Street API - Swagger Spec Tests', () => {
  it('GET /cats - should return array of cat names', async () => {
    const res = await request(app).get('/cats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((name: unknown) => {
      expect(typeof name).toBe('string');
    });
  });

  it('POST /cats - should create a new cat and return 201', async () => {
    const newCat = { name: 'Snowball', description: 'White cat in Hackney', location: 'Hackney' };

    const res = await request(app).post('/cats').send(newCat);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newCat);
    expect(typeof res.body.id).toBe('number');
  });

  it('GET /cats/{id} - should get cat by id', async () => {
    // Create cat first
    const id = 1;

    const res = await request(app).get(`/cats/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id,
      name: 'Whiskers',
      description: 'Siamese grey',
      location: 'Stockwell',
    });
  });

  it('GET /cats/{id} - should return 404 if cat not found', async () => {
    const res = await request(app).get('/cats/999999');
    expect(res.status).toBe(404);
  });

  it('PUT /cats/{id} - should update cat description', async () => {
    const id = 2;

    const updatedDescription = 'Updated description';
    const res = await request(app)
      .put(`/cats/${id}`)
      .send({ description: updatedDescription });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe(updatedDescription);
    expect(res.body.id).toBe(id);
  });

  it('PUT /cats/{id} - 404 if cat not found', async () => {
    const res = await request(app)
      .put('/cats/999999')
      .send({ description: 'Does not exist' });
    expect(res.status).toBe(404);
  });

  it('DELETE /cats/{id} - should delete cat', async () => {
    // Create cat first
    const createRes = await request(app).post('/cats').send({
      name: 'Shadow',
      description: 'Black cat',
    });
    const id = createRes.body.id;

    const res = await request(app).delete(`/cats/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Cat deleted');
  });
});