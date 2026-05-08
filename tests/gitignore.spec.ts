import { test, expect } from "@playwright/test";
import { execSync } from "child_process";
import path from "path";

const root = path.resolve(__dirname, "..");

function isIgnored(filePath: string): boolean {
  try {
    execSync(`git check-ignore -q "${filePath}"`, { cwd: root });
    return true;
  } catch {
    return false;
  }
}

test("tests/ directory is not gitignored", () => {
  expect(isIgnored("tests/")).toBe(false);
});

test("playwright.config.ts is not gitignored", () => {
  expect(isIgnored("playwright.config.ts")).toBe(false);
});

test("node_modules/ is gitignored", () => {
  expect(isIgnored("node_modules/")).toBe(true);
});
