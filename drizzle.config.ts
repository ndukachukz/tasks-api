// import 'doten'
import { defineConfig } from "drizzle-kit";

// import { env } from "./src/env";

console.log(process.env.DB_FILE_NAME);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
