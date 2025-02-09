import { Bot } from "grammy";

export class sendMessageCommand {
  constructor(private readonly bot: Bot) {}

  async execute(chatId: number | string, message: string): Promise<void> {
    try {
      await this.bot.api.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message");
    }
  }
}
