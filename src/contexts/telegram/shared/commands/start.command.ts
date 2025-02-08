import { Command } from "../types/command.type";

export const startCommand: Command = {
  command: "start",
  description: "Inicia el bot",
  handler: async ctx => {
    console.log("Comando start ejecutado");
    const message = `¡Hola, ${ctx.from?.first_name}! Soy el bot de Telegram de la aplicación de Node.js`;
    await ctx.reply(message);
  },
};
