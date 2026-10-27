import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import fs from "fs";

// Load .env.test in CI / test environment, otherwise .env.local
const envFile =
  process.env.CI || process.env.NODE_ENV === "test" || fs.existsSync(".env.test")
    ? ".env.test"
    : ".env.local";

dotenv.config({ path: envFile });
if (fs.existsSync(".env.test")) {
  dotenv.config({ path: ".env.test" });
}
if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
}
dotenv.config();

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
