import express, { Router } from "express";

import { ConsoleLogger } from "@/shared/logger/console-logger";

import { TwitchController } from "./twitch-controller";
import { BotManager } from "../../telegram/helpers/bot";

function createTwitchRouter(logger: ConsoleLogger, bot: BotManager) {
  const router = Router();
  const twitchController = new TwitchController({ logger }, bot);

  router.get("/", twitchController.run.bind(twitchController));
  router.post(
    "/eventsubcallback",
    twitchController.validate.bind(twitchController),
  );

  return router;
}

export { createTwitchRouter };
