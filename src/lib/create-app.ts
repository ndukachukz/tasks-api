import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from "bun";

import { logger } from "../middlewares/pino-logger";
import { AppBindings, AppOpenApi } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export function createApp() {
  const app = createRouter();
  app.use(logger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export function createWSApp(router: AppOpenApi) {
  const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

  router.get(
    "/ws",
    upgradeWebSocket((c) => {
      return {
        onOpen(evt, ws) {},
        onMessage(event, ws) {
          console.log(`Message from client: ${event.data}`);
          ws.send("Hello from server!");
        },
        onClose: () => {
          console.log("Connection closed");
        },
      };
    })
  );

  return { websocket };
}

export function createTestApp(router: AppOpenApi) {
  const testApp = createApp();

  testApp.route("/", router);

  return testApp;
}
