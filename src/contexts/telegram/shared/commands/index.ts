import { Command } from "../types/command.type";
import { addSubscriptions } from "./add-Subscriptions-twitch.commands";
import { removeSubscriptions } from "./delete-Subscription.command";
import { getSubscriptions } from "./get-All-Subscriptions.commands";
import { notifyStreamCommand } from "./notifiy.command";
import { saludameCommand } from "./saludame.command";
import { startCommand } from "./start.command";
import { streamCommand } from "./stream-status.commands";

// Aquí iremos agregando todos los comandos que creemos
export const commands: Command[] = [
  startCommand,
  saludameCommand,
  notifyStreamCommand,
  streamCommand,
  getSubscriptions,
  addSubscriptions,
  removeSubscriptions,
  // Otros comandos irán aquí
];
