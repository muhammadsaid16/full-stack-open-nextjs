import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env.test in test environment, otherwise .env.local
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.local";
dotenv.config({ path: envFile });
dotenv.config(); // fallback to .env if present

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/blog_app",
  },
});
