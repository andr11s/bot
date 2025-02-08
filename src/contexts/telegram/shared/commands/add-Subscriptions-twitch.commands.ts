import { isStreamLive } from "@/src/contexts/twitch/lib/get-stream-status";

import { Command } from "../types/command.type";
import { subscribeToEvent } from "@/src/contexts/twitch/lib/subscribe-To-Event";

export const addSubscriptions: Command = {
  command: "addSubscriptions",
  description: "Subcribe un usuario mediante el channel ID",
  handler: async ctx => {
    try {
      // Obtener el Channel ID del mensaje
      if (!ctx || !ctx.message?.text)
        throw new Error("El channel id es requerido");

      const args = ctx.message.text;

      if (!args || (args && typeof Number(args) !== "number")) {
        await ctx.reply("❌ Debes proporcionar un Channel ID válido.");
        return;
      }

      // Intentar suscribirse al evento
      await subscribeToEvent({ CHANNEL_ID: args });

      // Responder con confirmación
      await ctx.reply(
        `✅ Suscripción agregada correctamente para el canal con ID: ${args}`,
      );
    } catch (error) {
      console.error("🚨 Error al agregar la suscripción:", error);
      await ctx.reply(
        "❌ Ocurrió un error al agregar la suscripción. Intenta nuevamente.",
      );
    }
  },
};
