import crypto from "node:crypto";

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { config } from "@/src/app/config/config";

import { Logger } from "@/shared/logger/logger";

import { sendMessageCommand } from "../../telegram/shared/message";
import { BotManager } from "../../telegram/helpers/bot";
import { GroupsService } from "../../groups/services/groups.service";

export class TwitchController {
  private readonly logger;
  private bot: BotManager;
  private groupsService: GroupsService;
  constructor(
    dependencies: { logger: Logger },
    botManager: BotManager,
    groupsService: GroupsService,
  ) {
    this.logger = dependencies.logger;
    this.bot = botManager;
    this.groupsService = groupsService;
  }

  run(req: Request, res: Response) {
    this.logger.info("Received request to get twitch");
    res.status(StatusCodes.OK).send({ twitch: "ok" });
  }

  async validate(req: any, res: any) {
    this.logger.info("verifying twitch signature");

    const eventType = req.headers["twitch-eventsub-message-type"];

    if (!verifyTwitchSignature(req)) {
      console.error("🚨 Firma no válida");
      return res.status(403).send("Invalid signature");
    }

    if (eventType === "webhook_callback_verification") {
      console.log("✔️ Verificado por Twitch");
      return res.status(200).send(req.body.challenge);
    }

    if (
      eventType === "notification" &&
      req.body.subscription.type === "stream.online"
    ) {
      const botMessage = new sendMessageCommand(this.bot.getBot());

      const eventData = req.body.event;

      const messageText =
        `🎥 ${eventData.broadcaster_user_name} ha iniciado un stream!\n` +
        `📅 Fecha: ${new Date(eventData.started_at).toLocaleString("es-ES")}\n` +
        `🔗 Mira el stream aquí: https://twitch.tv/${eventData.broadcaster_user_login}`;

      const groups = await this.groupsService.getGroups();

      for (const element of groups) {
        await botMessage
          .execute(element.channelId, messageText)
          .catch((error: unknown) => {
            console.log("error al enviar message");
          });
      }
    }

    this.logger.info("Received request to post");
    res.sendStatus(200);
  }
}

function verifyTwitchSignature(req: Request): boolean {
  const HMAC_PREFIX = "sha256=";
  const message = `${req.headers["twitch-eventsub-message-id"]}${req.headers["twitch-eventsub-message-timestamp"]}${JSON.stringify(req.body)}`;

  const secret = config.server.CLIENT_SECRET ?? "";

  const signature = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
  const expectedSignature = HMAC_PREFIX + signature;
  return expectedSignature === req.headers["twitch-eventsub-message-signature"];
}
