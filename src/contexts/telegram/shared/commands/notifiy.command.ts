import { Context } from "grammy";

import { Command } from "../types/command.type";

export const notifyStreamCommand: Command = {
  command: "notify_stream",
  description: "Notifica a los usuarios de un stream en vivo",
  handler: async (ctx: Context) => {
    await ctx.reply(`🟢 example ha dejado de transmitir.`);
  },
};
