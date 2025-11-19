import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "./server.js";

describe("Cats API Endpoints", () => {
  it("GET /cats - should return all cat names", async () => {
    const response = await request(app).get("/cats");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("GET /cat/:id - should return a specific cat", async () => {
    const response = await request(app).get("/cat/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
  });

  it("GET /cat/:id - should return 404 for a non-existent cat", async () => {
    const response = await request(app).get("/cat/999");
    expect(response.status).toBe(404);
  });

  it("POST /cats - should create a new cat", async () => {
    const newCat = {
      name: "Test Cat",
      description: "A cat for testing",
      location: "Test Location",
    };
    const response = await request(app).post("/cats").send(newCat);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newCat.name);
  });

  it("POST /cats - should return 400 for missing data", async () => {
      const newCat = {
          name: "Test Cat",
          description: "A cat for testing",
      };
      const response = await request(app).post("/cats").send(newCat);
      expect(response.status).toBe(400);
  });

  it("PUT /cats/:id - should update a cat", async () => {
    const updatedDescription = { description: "An updated description" };
    const response = await request(app).put("/cats/1").send(updatedDescription);
    expect(response.status).toBe(200);
    expect(response.body.description).toBe(updatedDescription.description);
  });

  it("PUT /cats/:id - should return 404 for a non-existent cat", async () => {
      const updatedDescription = { description: "An updated description" };
      const response = await request(app).put("/cats/999").send(updatedDescription);
      expect(response.status).toBe(404);
  });

  it("DELETE /cats/:id - should delete a cat", async () => {
    const response = await request(app).delete("/cats/1");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Cat deleted");

    const getResponse = await request(app).get("/cat/1");
    expect(getResponse.status).toBe(404);
  });
});
