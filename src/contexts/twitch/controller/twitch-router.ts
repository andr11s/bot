import express, { Router } from "express";

import { ConsoleLogger } from "@/shared/logger/console-logger";

import { TwitchController } from "./twitch-controller";
import { BotManager } from "../../telegram/helpers/bot";
import { GroupsService } from "../../groups/services/groups.service";

function createTwitchRouter(
  logger: ConsoleLogger,
  bot: BotManager,
  group: GroupsService,
) {
  const router = Router();
  const twitchController = new TwitchController({ logger }, bot, group);

  router.get("/", twitchController.run.bind(twitchController));
  router.post(
    "/eventsubcallback",
    twitchController.validate.bind(twitchController),
  );

  return router;
}

export { createTwitchRouter };
