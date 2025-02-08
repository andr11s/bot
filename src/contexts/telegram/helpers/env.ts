import { config } from "dotenv";
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config();

export const configApp = {
  server: {
    port: process.env.PORT ?? 3000,
    BOT_TOKEN: process.env.BOT_TOKEN,
  },
};
