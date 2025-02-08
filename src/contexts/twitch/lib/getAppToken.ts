import axios from "axios";

const URL = "https://id.twitch.tv/oauth2/token";

export default async function getAppToken(): Promise<string> {
  try {
    const response = await axios.post(
      URL,
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data?.access_token) {
      throw new Error("Couldn't get access_token");
    }

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("error", error.response.data);
    } else {
      console.log("error", error);
    }

    throw new Error("Couldn't get access_token");
  }
}
