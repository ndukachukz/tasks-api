import { z } from "zod";
import { OpenAPIHono, RouteHandler, RouteConfig } from "@hono/zod-openapi";
import { PinoLogger } from "hono-pino";
import { selectTasksSchema } from "@/db/schema";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type AppOpenApi = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type SelectTasksSchema = z.infer<typeof selectTasksSchema>;
