import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

// Load .env.test in CI, otherwise .env.local
dotenv.config({ path: process.env.CI ? ".env.test" : ".env.local", quiet: true });

export default defineConfig({
  testDir: "./tests",
  // tests share the same database, so they can not be run in parallel
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "html" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
