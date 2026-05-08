import { defineConfig } from "@playwright/test";
import path from "path";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: `file://${path.resolve(__dirname, "docs")}/`,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
