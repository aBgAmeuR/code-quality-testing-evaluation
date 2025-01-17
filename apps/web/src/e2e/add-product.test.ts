import { test, expect } from "@playwright/test";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

test.describe("Add Product Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="text"]', "antoine");
    await page.fill('input[type="password"]', "antoine");
    await page.click('button[type="submit"]');
    await page.waitForURL("/products");
    await page.goto("/add-product");
  });

  test("should display add product form", async ({ page }) => {
    const form = await page.$("form");
    expect(form).not.toBeNull();
  });

  test("should show error on empty form submission", async ({ page }) => {
    await page.click('button[type="submit"]');
    const error = await page.waitForSelector(".text-red-600");
    expect(error).not.toBeNull();
  });

  test("should add product successfully", async ({ page }) => {
    const randomName = `test_${getRandomString(10)}`;
    const randomPrice = getRandomInt(1, 1000).toString();
    const randomStock = getRandomInt(1, 100).toString();

    await page.fill('input[placeholder="Product Name"]', randomName);
    await page.fill('input[placeholder="Price"]', randomPrice);
    await page.fill('input[placeholder="Stock"]', randomStock);
    await page.click('button[type="submit"]');
    await page.waitForURL("/products");
    expect(page.url()).toBe("http://127.0.0.1:3002/products");

    // search the product in the list
    await page.fill('[data-testid="search-input"]', randomName);
    await page.waitForTimeout(1000);
    const products = await page.$$('[data-testid^="product-"]');
    expect(products.length).toEqual(1);
  });
});
