import bot from "./helpers/bot";
import { commands } from "./shared/commands";

export async function run() {
  await bot.api.setMyCommands(
    commands.map(cmd => ({
      command: cmd.command,
      description: cmd.description,
    })),
  );

  console.info(`Bot ${bot.botInfo.username} is up and running  🚀`);
}

// export async function run() {
//   console.log("Starting app...");

//   await bot.init();

//   bot.use(async (ctx, next) => {
//     // console.log("⚡️ Nuevo evento recibido:", ctx.update);
//     console.log("⚡️ Nuevo evento recibido:");
//     await next();
//   });

//   for (const cmd of commands) {
//     bot.command(cmd.command, cmd.handler);
//   }

//   await bot.api.setMyCommands(
//     commands.map(cmd => ({
//       command: cmd.command,
//       description: cmd.description,
//     })),
//   );

//   await bot.start();

//   console.info(`Bot ${bot.botInfo.username} is up and running  🚀`);
// }
