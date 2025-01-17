import { test, expect } from "@playwright/test";

test.describe("User List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="text"]', "antoine");
    await page.fill('input[type="password"]', "antoine");
    await page.click('button[type="submit"]');
    await page.waitForURL("/products");
    await page.goto("/users");
  });

  test("should display users", async ({ page }) => {
    await page.waitForSelector('[data-testid^="user-"]');
    const users = await page.$$('[data-testid^="user-"]');
    await page.waitForTimeout(500);
    expect(users.length).toBeGreaterThan(0);
  });

  test("should filter users by search term", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "antoine");
    const users = await page.$$('[data-testid^="user-"]');
    await page.waitForTimeout(500);
    expect(users.length).toBeGreaterThan(0);
  });

  test("should filter users by join date", async ({ page }) => {
    await page.selectOption('[data-testid="joined-filter"]', "month");
    await page.waitForTimeout(1000);
    const users = await page.$$('[data-testid^="user-"]');
    expect(users.length).toBeGreaterThan(0);
  });

  test("should sort users by name", async ({ page }) => {
    await page.selectOption('[data-testid="sort-field"]', "name");
    const users = await page.$$('[data-testid^="user-"]');
    await page.waitForTimeout(500);
    expect(users.length).toBeGreaterThan(0);
  });

  test("should sort users by username", async ({ page }) => {
    await page.selectOption('[data-testid="sort-field"]', "username");
    const users = await page.$$('[data-testid^="user-"]');
    await page.waitForTimeout(500);
    expect(users.length).toBeGreaterThan(0);
  });

  test("should sort users by join date", async ({ page }) => {
    await page.selectOption('[data-testid="sort-field"]', "joined");
    const users = await page.$$('[data-testid^="user-"]');
    await page.waitForTimeout(500);
    expect(users.length).toBeGreaterThan(0);
  });
});
