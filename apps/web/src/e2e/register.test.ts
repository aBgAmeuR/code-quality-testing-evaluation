import { test, expect } from "@playwright/test";

function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should display register form", async ({ page }) => {
    const form = await page.$("form");
    expect(form).not.toBeNull();
  });

  test("should show error on empty form submission", async ({ page }) => {
    await page.click('button[type="submit"]');
    const error = await page.waitForSelector(".text-red-600");
    expect(error).not.toBeNull();
  });

  test("should register successfully", async ({ page }) => {
    const randomUsername = `user_${getRandomString(10)}`;
    const randomPassword = getRandomString(10);
    const randomFirstname = `First_${getRandomString(5)}`;
    const randomLastname = `Last_${getRandomString(5)}`;

    await page.fill('input[name="firstname"]', randomFirstname);
    await page.fill('input[name="lastname"]', randomLastname);
    await page.fill('input[name="username"]', randomUsername);
    await page.fill('input[name="password"]', randomPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL("/products");
    expect(page.url()).toBe("http://127.0.0.1:3002/products");
  });
});
