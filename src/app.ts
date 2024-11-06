import { createApp } from "./lib/create-app";
import configureOpenApi from "./middlewares/configure-openapi";
import indexRoutes from "./routes/index.routes";
import tasksRoutes from "./routes/tasks/tasks.index";

const app = createApp();

const routes = [indexRoutes, tasksRoutes];

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
