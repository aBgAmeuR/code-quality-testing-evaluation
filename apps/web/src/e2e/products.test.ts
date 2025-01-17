import { test, expect } from "@playwright/test";

test.describe("Product List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="text"]', "antoine");
    await page.fill('input[type="password"]', "antoine");
    await page.click('button[type="submit"]');
    await page.waitForURL("/products");
  });

  test("should display products", async ({ page }) => {
    await page.waitForSelector('[data-testid^="product-"]');
    const products = await page.$$('[data-testid^="product-"]');
    await page.waitForTimeout(500);
    expect(products.length).toBeGreaterThan(0);
  });

  test("should filter products by search term", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "smart");
    const products = await page.$$('[data-testid^="product-"]');
    await page.waitForTimeout(500);
    expect(products.length).toBeGreaterThan(0);
  });

  test("should filter products by price", async ({ page }) => {
    await page.selectOption('[data-testid="price-filter"]', "high");
    const products = await page.$$('[data-testid^="product-"]');
    await page.waitForTimeout(500);
    expect(products.length).toBeGreaterThan(0);
  });

  test("should filter products by stock", async ({ page }) => {
    await page.selectOption('[data-testid="stock-filter"]', "available");
    const products = await page.$$('[data-testid^="product-"]');
    await page.waitForTimeout(500);
    expect(products.length).toBeGreaterThan(0);
  });
});
