import app, { websocket } from "./app";
import { env } from "./env";

const port = env.PORT;

export default {
  fetch: app.fetch,
  port,
  websocket,
};
