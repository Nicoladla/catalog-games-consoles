import faker from "@faker-js/faker";
import app from "app";
import supertest from "supertest";
import { createConsole } from "../factories/consoles-factory";
import { createGame } from "../factories/games-factory";
import { cleanDb } from "../helpers";

const api = supertest(app);

beforeEach(async () => await cleanDb());

describe("GET /games", () => {
  it("Should respond status 200 and list of games", async () => {
    const gameCreated = await createGame();

    console.log(gameCreated);
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
