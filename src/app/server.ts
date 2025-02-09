import http from "node:http";
import { AddressInfo } from "node:net";

import express, { Express } from "express";
import { webhookCallback } from "grammy";

import { config } from "@/app/config/config";
import { healthRouter } from "@/app/health/api/health-router";

import { ConsoleLogger } from "@/shared/logger/console-logger";
import { Logger } from "@/shared/logger/logger";

import { userRouter } from "@/contexts/users/api/user-router";

import { BotManager } from "../contexts/telegram/helpers/bot";
import { createTwitchRouter } from "../contexts/twitch/controller/twitch-router";
import { UserService } from "../contexts/users/services/user.service";
import { Twitch } from "../contexts/telegram/shared/commands/twitch/twitch";
import { Command } from "../contexts/telegram/shared/types/command.type";
import { startCommand } from "../contexts/telegram/shared/commands/start.command";
import { saludameCommand } from "../contexts/telegram/shared/commands/saludame.command";

export class Server {
  private readonly app: Express;
  private httpServer?: http.Server;
  private readonly logger: Logger;
  private bot: BotManager;

  constructor() {
    this.logger = new ConsoleLogger();
    this.app = express();
    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: true }));

    const userService = new UserService("users");
    userService.init().then(c => {
      userService.createUserTable();
    });

    const twitch = new Twitch(userService);
    const getSubscriptionsCommand = twitch.getSubscriptionsCommand();
    const getStatusLiveStream = twitch.getStatusLiveStream();
    const deleteSubscription = twitch.deleteSubscription();
    const addSubscriptions = twitch.addSubscriptions();

    const commands: Command[] = [
      startCommand,
      saludameCommand,
      getSubscriptionsCommand,
      getStatusLiveStream,
      deleteSubscription,
      addSubscriptions,
    ];

    this.bot = new BotManager(config.server.BOT_TOKEN ?? "");
    this.bot.initialize();
    this.bot.loadCommands(commands);
    this.app.use("/webhook", webhookCallback(this.bot.getBot(), "express"));

    // this.app.use("/api/health", createHealthRouter(this.botTelegram));
    this.app.use("/api/users", userRouter);

    const twitchRouter = createTwitchRouter(this.logger, this.bot);
    this.app.use("/api/twitch", twitchRouter);

    this.app.use("/api/health", healthRouter);
    this.app.use("/api/users", userRouter);
  }

  async start(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer = this.app.listen(config.server.port, () => {
        const { port } = this.httpServer?.address() as AddressInfo;
        this.logger.info(`App is ready and listening on port ${port} 🚀`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close(error => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      }

      resolve();
    });
  }

  getHttpServer(): http.Server {
    if (!this.httpServer) {
      throw new Error("Server has not been started yet");
    }

    return this.httpServer;
  }
}
