import { test, expect } from "@playwright/test";

test("mock test", async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', exception => {
      console.log(`Uncaught exception: "${exception}"`);
  });

  await page.goto("http://localhost:5173/");
  await page.waitForTimeout(2000);
});
