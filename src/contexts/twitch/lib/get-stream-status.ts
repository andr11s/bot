/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";

import { config } from "@/src/app/config/config";

import getAppToken from "./getAppToken";

export async function isStreamLive(payload: {
  channelId: string;
}): Promise<boolean> {
  try {
    const { channelId } = payload;
    const token = await getAppToken();

    const streamResponse = await axios.get(
      `https://api.twitch.tv/helix/streams?user_id=${channelId}`,
      {
        headers: {
          "Client-ID": config.server.CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const isLive = streamResponse.data.data.length > 0;
    return isLive;
  } catch (error) {
    console.error("🚨 Error al consultar el estado del stream:", error);
    return false;
  }
}
