import { Bot, Context } from "grammy";
import { Command } from "../shared/types/command.type";

export class BotManager {
  private bot: Bot<Context>;
  private commands: any[]; // Define el tipo correcto para tus comandos

  constructor(token: string) {
    this.bot = new Bot<Context>(token, {
      ContextConstructor: Context,
    });
    this.commands = [];
  }

  public async initialize(): Promise<void> {
    await this.bot.init();

    this.bot.use(async (ctx, next) => {
      console.log("nuevo evento", ctx.update);

      if (
        ctx.chat &&
        (ctx.chat.type === "supergroup" || ctx.chat.type === "group")
      ) {
        // ... (código para registrar grupos)
      }
      await next();
    });
  }

  public loadCommands(commands: Command[]): void {
    for (const cmd of commands) {
      console.log("🤖 Comando registrado:", cmd.command);

      this.bot.command(cmd.command, cmd.handler);
    }
  }

  public start(): void {
    this.bot.start();
  }

  public getBot(): Bot<Context> {
    // Opcional: Para acceder a la instancia del bot desde fuera
    return this.bot;
  }
}
