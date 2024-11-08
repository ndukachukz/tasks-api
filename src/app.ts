import { createApp, createWSApp } from "./lib/create-app";
import configureOpenApi from "./middlewares/configure-openapi";
import indexRoutes from "./routes/index.routes";
import tasksRoutes from "./routes/tasks/tasks.index";

const app = createApp();
export const { websocket } = createWSApp(app);

const routes = [indexRoutes, tasksRoutes];

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number]; // use in client/frontend

export default app;
