import { Command } from "../types/command.type";

import { deleteSubscription } from "@/src/contexts/twitch/lib/delete-Subscription";

export const removeSubscriptions: Command = {
  command: "deleteSubscriptions",
  description: "Elimina un usuario de la subcripcion mediante el channel ID",
  handler: async ctx => {
    try {
      // Obtener el Channel ID del mensaje
      if (!ctx || !ctx.message?.text)
        throw new Error("El channel id es requerido");

      const args = ctx.message.text;

      const subscriptionId = args.split(" ").slice(1).join(" ");

      if (!subscriptionId) {
        await ctx.reply("❌ Debes proporcionar un Channel ID válido.");
        return;
      }

      // Intentar eliminar la suscripcion al evento
      await deleteSubscription(subscriptionId);

      // Responder con confirmación
      await ctx.reply(
        `✅ Suscripción eliminada correctamente para el canal con ID: ${subscriptionId}`,
      );
    } catch (error) {
      console.error("🚨 Error al eliminar la suscripción:", error);
      await ctx.reply(
        "❌ Ocurrió un error al eliminar la suscripción. Intenta nuevamente.",
      );
    }
  },
};
