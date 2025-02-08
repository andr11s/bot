import { Bot, Context } from "grammy";

import { commands } from "../shared/commands";
import { configApp } from "./env";

const bot = new Bot<Context>(configApp.server.BOT_TOKEN ?? "", {
  ContextConstructor: Context,
});

await bot.init();
const groupIds = new Set<number>();

bot.use(async (ctx, next) => {
  // agrega log de la informacion del ctx
  console.log("nuevo evento", ctx.update);

  if (
    ctx.chat &&
    (ctx.chat.type === "supergroup" || ctx.chat.type === "group")
  ) {
    groupIds.add(ctx.chat.id);
    console.log("📌 El bot está en estos grupos:", [...groupIds]);
  }
  await next();
});

for (const cmd of commands) {
  console.log("🤖 Comando registrado:", cmd.command);

  bot.command(cmd.command, cmd.handler);
}

export default bot;
