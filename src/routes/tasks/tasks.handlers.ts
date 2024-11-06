import * as HttpStatusCodes from "stoker/http-status-codes";

import { CreateRoute, GetByIdRoute, ListRoute } from "./tasks.routes";
import { AppRouteHandler } from "@/lib/types";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";

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

  return c.json(task, HttpStatusCodes.OK);
};
