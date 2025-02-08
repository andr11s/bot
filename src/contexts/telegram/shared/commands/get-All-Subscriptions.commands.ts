import { Context } from "grammy";

import { Command } from "../types/command.type";
import { getAllSubscriptions } from "@/src/contexts/twitch/lib/get-All-Subscriptions";

export const getSubscriptions: Command = {
  command: "allSubscriptions",
  description: "Retorna la lista de suscripciones de Twitch",
  handler: async (ctx: Context) => {
    console.log("📡 Obteniendo suscripciones...");

    const subscriptions = await getAllSubscriptions();

    if (subscriptions.length === 0) {
      await ctx.reply("❌ No hay suscripciones activas en Twitch.");
      return;
    }
    subscriptions.forEach(a => console.log(a));

    const message = subscriptions
      .map(
        sub =>
          `📌 🆔 ${sub.id}| Channel ID ${sub.condition.broadcaster_user_id}`,
      )
      .join("\n");

    await ctx.reply(`🔔 **Lista de suscripciones activas:**\n${message}`);
  },
};
