import prisma from "config/database";

export async function cleanDb() {
  await prisma.console.deleteMany();
  await prisma.game.deleteMany();
}
