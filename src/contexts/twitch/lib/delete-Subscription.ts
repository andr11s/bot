import axios from "axios";
import getAppToken from "./getAppToken";
import { config } from "@/src/app/config/config";

export async function deleteSubscription(subscriptionId: string) {
  const token = await getAppToken();

  try {
    await axios.delete(
      `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`,
      {
        headers: {
          "Client-ID": config.server.CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(`✅ Suscripción ${subscriptionId} eliminada correctamente`);
  } catch (error) {
    console.error(`🚨 Error al eliminar la suscripción ${subscriptionId}`);
    console.error(error);

    throw new Error("Error unsubscribing to stream.online");
  }
}
