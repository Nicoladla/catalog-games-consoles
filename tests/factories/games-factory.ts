import faker from "@faker-js/faker";
import prisma from "config/database";
import { createConsole } from "./consoles-factory";

export async function createGame() {
  const consoleCreated = await createConsole();

  return await prisma.game.create({
    data: {
      title: faker.name.firstName(),
      consoleId: consoleCreated.id,
    },
  });
}
