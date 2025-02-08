import express from "express";

import { ConsoleLogger } from "@/shared/logger/console-logger";

import { TwitchController } from "./twitch-controller";

const twitchRouter = express.Router();

const logger = new ConsoleLogger();
const twichController = new TwitchController({ logger });

twitchRouter.get("/", twichController.run.bind(twichController));
twitchRouter.post(
  "/eventsubcallback",
  twichController.validate.bind(twichController),
);

export { twitchRouter };
