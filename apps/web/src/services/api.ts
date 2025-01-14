/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { log } from "@repo/logger";
import axios from "axios";

import { Product, User } from "../types";
import { useStore } from "~/lib/store";

const API_URL = "http://localhost:5001/api";

interface AuthResponse {
  token: string;
  user: User;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      username,
      password
    });
    useStore((state) => state.setToken(response.data.token));
    useStore((state) => state.setUser(response.data.user));
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const registerUser = async (
  userData: Partial<User>
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/register`,
    userData
  );
  useStore((state) => state.setToken(response.data.token));
  return response.data;
};

export async function getUsers(): Promise<User[]> {
  const token = useStore((state) => state.token);
  return axios
    .get<User[]>(`${API_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => response.data);
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const token = useStore((state) => state.token);
    const response = await axios.get<{ data: Product[] }>(
      `${API_URL}/products`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data.data;
  } catch (err) {
    log("Error fetching products:", err);
    return [];
  }
};

export const createProduct = async (
  productData: Partial<Product>
): Promise<Product> => {
  const token = useStore((state) => state.token);
  const response = await axios.post<Product>(
    `${API_URL}/products`,
    productData,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const logout = (): void => {
  useStore((state) => state.setToken(null));
  useStore((state) => state.setUser(null));
};
