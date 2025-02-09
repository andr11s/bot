import axios from "axios";
import getAppToken from "./getAppToken";
import { config } from "@/src/app/config/config";

export async function getBySubscriptionId(subscriptionId: string | number) {
  const token = await getAppToken();

  try {
    const info = await axios.get(
      `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`,
      {
        headers: {
          "Client-ID": config.server.CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return info.data.data;
  } catch (error) {
    console.error(`🚨 Error al eliminar la suscripción ${subscriptionId}`);
    console.error(error);

    throw new Error("Error unsubscribing to stream.online");
  }
}
