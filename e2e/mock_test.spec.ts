import { test, expect } from "@playwright/test";

test("mock test", async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', exception => {
      console.log(`Uncaught exception: "${exception}"`);
  });

  await page.addInitScript(() => {
      if (!window.ipcRenderer) {
        window.ipcRenderer = {
          invoke: async () => ({ success: true, data: [] }),
          send: () => {},
          on: () => {},
        } as any;
      }
      if (!window.apm_store) {
        window.apm_store = { arch: "amd64" } as any;
      }
  });

  await page.goto("/");
  await page.waitForTimeout(5000);
});
