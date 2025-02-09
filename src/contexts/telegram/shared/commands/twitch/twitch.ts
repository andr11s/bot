import { getAllSubscriptions } from "@/src/contexts/twitch/lib/get-All-Subscriptions";
import { UserService } from "@/src/contexts/users/services/user.service";
import { Command } from "../../types/command.type";
import { Context } from "grammy";
import { isStreamLive } from "@/src/contexts/twitch/lib/get-stream-status";
import { deleteSubscription } from "@/src/contexts/twitch/lib/delete-Subscription";
import { subscribeToEvent } from "@/src/contexts/twitch/lib/subscribe-To-Event";
import { getBySubscriptionId } from "@/src/contexts/twitch/lib/get-by-Subscription copy";

interface Subscription {
  id: string;
  condition: {
    broadcaster_user_id: string;
  };
}

export class Twitch {
  private userService: UserService;

  private SUPER_ADMIN = 75707881;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public getSubscriptionsCommand(): Command {
    return {
      command: "allSubscriptions",
      description: "Retorna la lista de suscripciones de Twitch",
      handler: async (ctx: Context) => {
        const userId = ctx.from?.id;
        if (userId !== this.SUPER_ADMIN) {
          await ctx.reply(
            "❌ No estas autorizado para acceder a las subcripciones",
          );
          return;
        }

        console.log("📡 Obteniendo suscripciones...");

        const subscriptions: Subscription[] = await getAllSubscriptions();
        const usersSubcription = await this.userService.getUsers();

        if (subscriptions.length === 0 || usersSubcription.length === 0) {
          await ctx.reply("❌ No hay suscripciones activas en Twitch.");
          return;
        }

        const message = subscriptions
          .map(sub => {
            const exist = usersSubcription.some(
              u => u.channelId === sub.condition.broadcaster_user_id,
            );
            if (exist)
              return `📌 Usuario suscrito: Channel ID ${sub.condition.broadcaster_user_id}`;
          })
          .join("\n");

        await ctx.reply(`🔔 **Lista de suscripciones activas:**\n${message}`);
      },
    };
  }

  public getStatusLiveStream() {
    return {
      command: "liveStream",
      description: "Muestra el id del stream",
      handler: async (ctx: Context) => {
        if (!ctx || !ctx.message?.text)
          throw new Error("El channel id es requerido");

        const args = ctx.message?.text.split(" ").slice(1).join(" ");

        const isLive = await isStreamLive({ channelId: args });

        const message = `El id del stream es: ${args} y está ${isLive ? "en vivo" : "offline"}`;
        await ctx.reply(message);
      },
    };
  }

  public deleteSubscription() {
    return {
      command: "deleteSubscriptions",
      description:
        "Elimina un usuario de la subcripcion mediante el channel ID",
      handler: async (ctx: Context) => {
        try {
          const userId = ctx.from?.id;
          if (userId !== this.SUPER_ADMIN) {
            await ctx.reply(
              "❌ No estas autorizado para acceder a las subcripciones",
            );
            return;
          }

          if (!ctx || !ctx.message?.text)
            throw new Error("El channel id es requerido");

          const args = ctx.message.text;

          const subscriptionId = args.split(" ").slice(1).join(" ");

          if (!subscriptionId) {
            await ctx.reply("❌ Debes proporcionar un Channel ID válido.");
            return;
          }

          const subscription = await getBySubscriptionId(subscriptionId);

          if (!subscription) {
            await ctx.reply("Este channelId no esta registrado");
            return;
          }

          await deleteSubscription(subscription[0].id);

          const existChannelId = await this.userService.getByDynamicQuery(
            "channelId",
            subscription[0].condition.broadcaster_user_id,
          );

          if (!existChannelId) {
            await ctx.reply(
              `✅ Suscripción eliminada correctamente para el canal con ID: ${subscription[0].condition.broadcaster_user_id}`,
            );
            return;
          }

          await this.userService.deleteUser(existChannelId?.channelId);

          await ctx.reply(
            `✅ Suscripción eliminada correctamente para el canal con ID: ${subscription[0].condition.broadcaster_user_id}`,
          );
        } catch (error) {
          await ctx.reply(
            "❌ Ocurrió un error al eliminar la suscripción. Intenta nuevamente.",
          );
        }
      },
    };
  }

  public addSubscriptions() {
    return {
      command: "addSubscriptions",
      description: "Subcribe un usuario mediante el channel ID",
      handler: async (ctx: Context) => {
        try {
          const userId = ctx.from?.id;
          if (userId !== this.SUPER_ADMIN) {
            await ctx.reply(
              "❌ No estas autorizado para acceder a las subcripciones",
            );
            return;
          }
          // Obtener el Channel ID del mensaje
          if (!ctx || !ctx.message?.text)
            throw new Error("El channel id es requerido");

          const args = ctx.message?.text.split(" ").slice(1).join(" ");

          if (!args || (args && typeof Number(args) !== "number")) {
            await ctx.reply("❌ Debes proporcionar un Channel ID válido.");
            return;
          }
          console.log("llego");

          const existChannelId = await this.userService.getByDynamicQuery(
            "channelId",
            args,
          );

          if (existChannelId) {
            await ctx.reply("Este channelId esta registrado");
            return;
          }

          // Intentar suscribirse al evento
          await subscribeToEvent({ CHANNEL_ID: args });

          await this.userService.addUser(args);

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
  }
}
