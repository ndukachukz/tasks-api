import { describe, expectTypeOf, expect, it } from "vitest";
import { testClient } from "hono/testing";

import router from "./tasks.index";
import { createApp, createTestApp } from "@/lib/create-app";
import { SelectTasksSchema } from "@/lib/types";

describe("Task list", () => {
  it("responds with an array", async () => {
    const testRouter = createTestApp(router);
    const response = await testRouter.request("/tasks");
    const result = await response.json();

    console.log(result);
    expect(result).toBeInstanceOf(Array);
  });

  it("responds with an array => Test Client", async () => {
    const testApp = createApp();
    const testRouter = testApp.route("/", router);
    const client = testClient(testRouter);

    const response = await client.tasks.$get();
    const result = await response.json();

    console.log(result);
    expect(result).toBeInstanceOf(Array);
  });

  it("validated the id param", async () => {
    const client = testClient(createApp().route("/", router));

    const response = await client.tasks[":id"].$get({
      param: {
        id: "wat",
      },
    });

    expect(response.status).toBe(422);
  });
});
