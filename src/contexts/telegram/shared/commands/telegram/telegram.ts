import { GroupsService } from "@/src/contexts/groups/services/groups.service";
import { Context } from "grammy";

export class Telegram {
  private groupsService: GroupsService;

  constructor(groupsService: GroupsService) {
    this.groupsService = groupsService;
  }

  public notifyStreamCommand() {
    return {
      command: "notify_stream",
      description: "Notifica a los usuarios de un stream en vivo",
      handler: async (ctx: Context) => {
        if (!ctx || !ctx.chat) throw new Error("El channel id es requerido");

        const chatId = ctx.chat.id;

        const exist = await this.groupsService.getByDynamicQuery(
          "channelId",
          chatId,
        );
        if (exist) {
          const message = `Este grupo con ID: ${chatId} ya tiene la notificaciones habilitadas!`;
          await ctx.reply(message);
          return;
        }

        await this.groupsService.addGroup(chatId);
        const message = `¡Notificaciones habilitadas para el grupo con ID: ${chatId}!`;
        await ctx.reply(message);
      },
    };
  }
}
