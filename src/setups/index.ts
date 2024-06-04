import { setupInteractive } from "../interactive/interactive.cluster";
import connectToDBs from "../db/index.database";
import seedSetup from "./seed.setup";
import { createChild } from "../worker";
import { join } from "path";


export default async function setup() {
  await setupInteractive();
  const dbResults = await connectToDBs({ mongo: process.env["MONGODB_URL"].split(",").map((el) => el.trim()), redis: process.env["REDIS_URL"] });
  await seedSetup();
  const child = createChild(join(__dirname, '../worker/consumer.process.ts'));
  child.send({ type: "command", data: { command: "start" } });
};