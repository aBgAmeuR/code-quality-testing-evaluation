import { afterEach, describe, expect, test } from "@jest/globals";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import {
  createProduct,
  getProducts,
  getUsers,
  loginUser,
  registerUser
} from "../services/api";

const mock = new MockAdapter(axios);

describe("API tests", () => {
  afterEach(() => {
    mock.reset();
  });

  test("loginUser success", async () => {
    const mockResponse = {
      token: "test-token",
      user: { id: 1, username: "testuser" }
    };
    mock
      .onPost("http://localhost:5001/api/auth/login")
      .reply(200, mockResponse);

    const response = await loginUser("testuser", "password");
    expect(response).toEqual(mockResponse);
  });

  test("registerUser success", async () => {
    const mockResponse = {
      token: "test-token",
      user: { id: 1, username: "newuser" }
    };
    mock
      .onPost("http://localhost:5001/api/auth/register")
      .reply(200, mockResponse);

    const response = await registerUser({
      username: "newuser",
      password: "password"
    });
    expect(response).toEqual(mockResponse);
  });

  test("getUsers success", async () => {
    const mockResponse = [{ id: 1, username: "testuser" }];
    mock.onGet("http://localhost:5001/api/auth/users").reply(200, mockResponse);

    const response = await getUsers();
    expect(response).toEqual(mockResponse);
  });

  test("getProducts success", async () => {
    const mockResponse = { data: [{ id: 1, name: "product1" }] };
    mock.onGet("http://localhost:5001/api/products").reply(200, mockResponse);

    const response = await getProducts();
    expect(response).toEqual(mockResponse.data);
  });

  test("createProduct success", async () => {
    const mockResponse = { id: 1, name: "newproduct" };
    mock.onPost("http://localhost:5001/api/products").reply(200, mockResponse);

    const response = await createProduct({ name: "newproduct" });
    expect(response).toEqual(mockResponse);
  });
});
