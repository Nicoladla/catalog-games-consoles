import faker from "@faker-js/faker";
import app from "app";
import prisma from "config/database";
import supertest from "supertest";
import { createConsole } from "../factories/consoles-factory";
import { createGame } from "../factories/games-factory";
import { cleanDb } from "../helpers";

const api = supertest(app);

beforeEach(async () => await cleanDb());

describe("GET /games", () => {
  it("Should respond status 200 and list of games", async () => {
    const gameCreated = await createGame();

    const result = await api.get("/games");

    expect(result.status).toBe(200);
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: gameCreated.id,
          title: gameCreated.title,
          consoleId: gameCreated.consoleId,
        }),
      ])
    );
  });

  it("Should respond status 200 and games list empty", async () => {
    const result = await api.get("/games");

    expect(result.status).toBe(200);
    expect(result.body).toEqual([]);
  });
});

describe("GET /games/:id", () => {
  it("Should respond status 404 if gamesId is not a number.", async () => {
    const result = await api.get(`/games/asdas`);

    expect(result.status).toBe(404);
  });

  it("Should respond status 404 if games not found in search", async () => {
    const result = await api.get(`/games/0`);

    expect(result.status).toBe(404);
  });

  it("Should respond status 200 and a specific games", async () => {
    const gameCreated = await createGame();

    const result = await api.get(`/games/${gameCreated.id}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      id: gameCreated.id,
      title: gameCreated.title,
      consoleId: gameCreated.consoleId,
    });
  });
});

describe("POST /games", () => {
  it("Should respond status 409 if the game is already registered in the database", async () => {
    const gameCreated = await createGame();

    const result = await api
      .post("/games")
      .send({ title: gameCreated.title, consoleId: gameCreated.id });

    expect(result.status).toBe(409);
  });

  it("Must respond status 409 if consoloId does not exist", async () => {
    const title = faker.name.firstName();

    const result = await api.post("/games").send({ title, consoleId: 0 });

    expect(result.status).toBe(409);
  });

  it("Should respond status 422 if game title is in an invalid format", async () => {
    const consoleCreated = await createConsole();
    const result = await api
      .post("/games")
      .send({ title: 1223, consoleId: consoleCreated.id });

    expect(result.status).toBe(422);
  });

  it("Should respond status 201 if the games was successfully created in the database", async () => {
    const consoleCreated = await createConsole();
    const title = faker.name.firstName();

    const result = await api
      .post("/games")
      .send({ title, consoleId: consoleCreated.id });

    const sideEffect = await api.get(`/games`);

    expect(result.status).toBe(201);
    expect(sideEffect.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title,
          consoleId: consoleCreated.id,
        }),
      ])
    );
  });
});
