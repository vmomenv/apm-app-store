import { test, expect } from "@playwright/test";

test.describe("应用基本功能", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("页面应该正常加载", async ({ page }) => {
    await expect(page).toHaveTitle(/星火应用商店|APM 应用商店|Spark Store/);
  });

  test("应该显示应用列表", async ({ page }) => {
    await page.waitForSelector(".app-card", { timeout: 10000 });
    const appCards = page.locator(".app-card");
    await expect(appCards.first()).toBeVisible();
  });

  test("搜索功能应该工作", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="搜索"]').first();
    await expect(searchInput).toBeVisible();

    await searchInput.fill("test");
    await searchInput.press("Enter");

    await page.waitForTimeout(1000);
  });
});
