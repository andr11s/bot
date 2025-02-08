import axios from "axios";

import getAppToken from "./getAppToken";
import { config } from "@/src/app/config/config";

export async function subscribeToEvent(payload: { CHANNEL_ID: string }) {
  const { CHANNEL_ID } = payload;

  const token = await getAppToken();
  try {
    await axios.post(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        type: "stream.online",
        version: "1",
        condition: { broadcaster_user_id: CHANNEL_ID },
        transport: {
          method: "webhook",
          callback: config.server.CALLBACK_URL,
          secret: config.server.CLIENT_SECRET, // Se usa para validar las firmas de los eventos
        },
      },
      {
        headers: {
          "Client-ID": config.server.CLIENT_ID,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("📡 Suscrito a stream.online!");
  } catch (error) {
    console.error("🚨 Error al suscribirse a stream.online");
    throw new Error("Error subscribing to stream.online");
  }
}
