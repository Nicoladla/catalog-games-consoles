import app from "app";
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

describe("GET /consoles/:id", () => {});

describe("POST /consoles", () => {});
