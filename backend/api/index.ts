import type { IncomingMessage, ServerResponse } from "http";
import { buildApp } from "../src/app.js";

let appReady: ReturnType<typeof buildApp> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!appReady) {
    appReady = buildApp();
  }
  const app = await appReady;
  app.server.emit("request", req, res);
}
