import {
  jsonContent,
  jsonContentOneOf,
  jsonContentRequired,
} from "stoker/openapi/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {
  insertTasksSchema,
  patchTasksSchema,
  selectTasksSchema,
} from "@/db/schema";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Tasks"];

export const list = createRoute({
  path: "/tasks",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      "List of tasks"
    ),
  },
});

export const create = createRoute({
  path: "/tasks",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertTasksSchema, "Task "),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectTasksSchema,
      "The created task"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      "Validation error(s)"
    ),
  },
});

export const getById = createRoute({
  path: "/tasks/{id}",
  method: "get",
  request: { params: IdParamsSchema },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTasksSchema, "Requested task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Requested task not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID error"
    ),
  },
});

export const patch = createRoute({
  path: "/tasks/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchTasksSchema, "The task updates"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(patchTasksSchema, "Updated task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Requested task not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchTasksSchema).or(createErrorSchema(IdParamsSchema)),
      "Validation error(s)"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetByIdRoute = typeof getById;
export type PatchRoute = typeof patch;
