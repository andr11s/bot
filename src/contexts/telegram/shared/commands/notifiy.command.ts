import { Context } from "grammy";

import { Command } from "../types/command.type";

export const notifyStreamCommand: Command = {
  command: "notify_stream",
  description: "Notifica a los usuarios de un stream en vivo",
  handler: async (ctx: Context) => {
    if (!ctx || !ctx.chat) throw new Error("El channel id es requerido");

    const chatId = ctx.chat.id;

    const message = `¡Notificaciones habilitadas para el grupo con ID: ${chatId}!`;
    await ctx.reply(message);
  },
};
