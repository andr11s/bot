import { isStreamLive } from "@/src/contexts/twitch/lib/get-stream-status";

import { Command } from "../types/command.type";

export const streamCommand: Command = {
  command: "stream",
  description: "Muestra el id del stream",
  handler: async ctx => {
    if (!ctx || !ctx.message?.text)
      throw new Error("El channel id es requerido");

    const args = ctx.message?.text.split(" ").slice(1).join(" ");

    const isLive = await isStreamLive({ channelId: args });

    const message = `El id del stream es: ${args} y está ${isLive ? "en vivo" : "offline"}`;
    await ctx.reply(message);
  },
};
