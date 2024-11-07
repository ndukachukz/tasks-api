import { z } from "zod";
import Bun from "bun";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3002),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  DB_FILE_NAME: z.string(),
  /*     DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(), */
});
/*   .superRefine((input, ctx) => {
    if (input.NODE_ENV === "production" && !input.DATABASE_AUTH_TOKEN)
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "string",
        received: "undefined",
        path: ["DATABASE_AUTH_TOKEN"],
        message: "Must be set when NODE_ENV is 'production'",
      });
  }); */

type EnvSchema = z.infer<typeof envSchema>;

declare module "bun" {
  interface Env extends EnvSchema {}
}

const { data, error, success } = envSchema.safeParse(Bun.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

let env = data!;

export { env };
