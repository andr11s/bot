import { Context } from "grammy";

import { Command } from "../types/command.type";

export const saludameCommand: Command = {
  command: "saludame",
  description: "Te saluda de manera amistosa",
  handler: async (ctx: Context) => {
    const userName = ctx.from?.first_name ?? "amigo";
    await ctx.reply(`¡Hola ${userName}! 👋 ¡Es un gusto saludarte!`);
  },
};
