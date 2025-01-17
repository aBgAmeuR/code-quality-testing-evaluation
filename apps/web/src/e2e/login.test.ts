import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    const form = await page.$("form");
    expect(form).not.toBeNull();
  });

  test("should show error on invalid login", async ({ page }) => {
    await page.fill('input[type="text"]', "invalidUser");
    await page.fill('input[type="password"]', "invalidPass");
    await page.click('button[type="submit"]');
    const error = await page.waitForSelector(".text-red-600");
    expect(error).not.toBeNull();
  });

  test("should redirect to products page on successful login", async ({
    page
  }) => {
    await page.fill('input[type="text"]', "antoine");
    await page.fill('input[type="password"]', "antoine");
    await page.click('button[type="submit"]');
    await page.waitForURL("/products");
    expect(page.url()).toBe("http://127.0.0.1:3002/products");
  });
});
