import faker from "@faker-js/faker";
import app from "app";
import { object } from "joi";
import supertest from "supertest";
import { createConsole } from "../factories/consoles-factory";
import { cleanDb } from "../helpers";

const api = supertest(app);

beforeEach(async () => await cleanDb());

describe("GET /consoles", () => {
  it("Should respond status 200 and list of consoles", async () => {
    const consoleCreated = await createConsole();

    const result = await api.get("/consoles");

    expect(result.status).toBe(200);
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: consoleCreated.id,
          name: consoleCreated.name,
        }),
      ])
    );
  });

  it("Should respond status 200 and consoles list empty", async () => {
    const result = await api.get("/consoles");

    expect(result.status).toBe(200);
    expect(result.body).toEqual([]);
  });
});

describe("GET /consoles/:id", () => {
  it("Should respond status 404 if consoleId is not a number.", async () => {
    const result = await api.get(`/consoles/asdas`);

    expect(result.status).toBe(404);
  });

  it("Should respond status 404 if console not found in search", async () => {
    const result = await api.get(`/consoles/0`);

    expect(result.status).toBe(404);
  });

  it("Should respond status 200 and a specific console", async () => {
    const consoleCreated = await createConsole();

    const result = await api.get(`/consoles/${consoleCreated.id}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      id: consoleCreated.id,
      name: consoleCreated.name,
    });
  });
});

describe("POST /consoles", () => {
  it("Should respond status 409 if the console is already registered in the database", async () => {
    const consoleCreated = await createConsole();

    const result = await api
      .post("/consoles")
      .send({ name: consoleCreated.name });

    expect(result.status).toBe(409);
  });

  it("Should respond status 422 if console name is in an invalid format", async () => {
    const result = await api.post("/consoles").send({ name: 1223 });

    expect(result.status).toBe(422);

  });

  it("Should respond status 201 if the console was successfully created in the database", async () => {
    const consoleName = faker.name.firstName();

    const result = await api.post("/consoles").send({ name: consoleName });
    const sideEffect = await api.get(`/consoles`);

    expect(result.status).toBe(201);
    expect(sideEffect.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: consoleName,
        }),
      ])
    );
  });
});
