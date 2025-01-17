import { describe, expect, test } from "@jest/globals";

import { isAuthenticated } from "../utils/auth";
import {
  formatDate,
  formatPrice,
  formatStock,
  formatUserName,
  formatSearchTerm
} from "../utils/formatting";
import {
  validateEmail,
  validatePassword,
  validateUser,
  validateProduct
} from "../utils/validation";

describe("Validation Utils", () => {
  test("validateEmail", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
  });

  test("validatePassword", () => {
    const validPassword = validatePassword("Valid123");
    expect(validPassword.isValid).toBe(true);

    const invalidPassword = validatePassword("short");
    expect(invalidPassword.isValid).toBe(false);
    expect(invalidPassword.errors).toContain(
      "Password must be at least 8 characters"
    );
  });

  test("validateUser", () => {
    const validUser = validateUser({
      firstname: "John",
      lastname: "Doe",
      username: "johndoe",
      password: "Valid123"
    });
    expect(validUser.isValid).toBe(true);

    const invalidUser = validateUser({
      firstname: "",
      lastname: "",
      username: "jd",
      password: "short"
    });
    expect(invalidUser.isValid).toBe(false);
    expect(invalidUser.errors.firstname).toBe("First name is required");
    expect(invalidUser.errors.lastname).toBe("Last name is required");
    expect(invalidUser.errors.username).toBe("Username too short");
    expect(invalidUser.errors.password).toContain(
      "Password must be at least 8 characters"
    );
  });

  test("validateProduct", () => {
    const validProduct = validateProduct({
      name: "Product",
      price: 10,
      stock: 5
    });
    expect(validProduct.valid).toBe(true);

    const invalidProduct = validateProduct({
      name: "",
      price: -10,
      stock: -5
    });
    expect(invalidProduct.valid).toBe(false);
    expect(invalidProduct.errors.name).toBe("Name is required");
    expect(invalidProduct.errors.price).toBe("Price must be positive");
    expect(invalidProduct.errors.stock).toContain("Stock cannot be negative");
  });
});

describe("Formatting Utils", () => {
  test("formatDate", () => {
    expect(formatDate("2023-10-10")).toBe("10/10/2023");
    expect(formatDate("invalid-date")).toBe("Invalid Date");
  });

  test("formatPrice", () => {
    expect(formatPrice("1234.56")).toBe("$1,234.56");
    expect(formatPrice("invalid-price")).toBe("$0.00");
  });

  test("formatStock", () => {
    expect(formatStock("10")).toBe("In Stock (10)");
    expect(formatStock("3")).toBe("Low Stock (3 left)");
    expect(formatStock("0")).toBe("Out of Stock");
    expect(formatStock("invalid-stock")).toBe("Out of Stock");
  });

  test("formatUserName", () => {
    expect(formatUserName("John", "Doe")).toBe("John Doe");
    expect(formatUserName("", "Doe")).toBe("Doe");
    expect(formatUserName("John", "")).toBe("John");
    expect(formatUserName("", "")).toBe("Unknown User");
  });

  test("formatSearchTerm", () => {
    expect(formatSearchTerm("  hello world  ")).toBe("Hello World");
    expect(formatSearchTerm("")).toBe("");
  });
});

describe("Auth Utils", () => {
  test("isAuthenticated", () => {
    localStorage.setItem("token", "test-token");
    expect(isAuthenticated()).toBe(true);

    localStorage.removeItem("token");
    expect(isAuthenticated()).toBe(false);
  });
});
