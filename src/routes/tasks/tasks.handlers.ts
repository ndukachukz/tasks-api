import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  PatchRoute,
} from "./tasks.routes";
import { AppRouteHandler } from "@/lib/types";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.tasksTable.findMany();

  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");

  const [inserted] = await db.insert(tasksTable).values(task).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getById: AppRouteHandler<GetByIdRoute> = async (c) => {
  const params = c.req.valid("param");

  const task = await db.query.tasksTable.findFirst({
    where: (tasks, { eq }) => eq(tasks.id, params.id),
  });

  if (!task)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(task, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const [task] = await db
    .update(tasksTable)
    .set(updates)
    .where(eq(tasksTable.id, id))
    .returning();

  if (!task)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(task, HttpStatusCodes.OK);
};
