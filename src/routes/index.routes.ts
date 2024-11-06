import { jsonContent } from "stoker/openapi/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { createRouter } from "../lib/create-app";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const router = createRouter().openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Tasks API"),
        "Task API Index"
      ),
    },
  }),
  (c) => {
    return c.json({ message: "tasks api" });
  }
);

export default router;
