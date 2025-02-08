import axios from "axios";
import getAppToken from "./getAppToken";
import { config } from "@/src/app/config/config";

export async function getAllSubscriptions(): Promise<any[]> {
  const token = await getAppToken();

  try {
    const response = await axios.get(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        headers: {
          "Client-ID": config.server.CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data; // Devuelve todas las suscripciones
  } catch (error) {
    console.error("🚨 Error al obtener suscripciones", error);
    return [];
  }
}
