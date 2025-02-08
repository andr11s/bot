import { Context } from "grammy";

export interface Command {
  command: string;
  description: string;
  handler: (ctx: Context) => Promise<void>;
}