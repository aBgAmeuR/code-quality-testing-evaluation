"use client";

import { useEffect, useState } from "react";

import { log } from "@repo/logger";
import { useRouter } from "next/navigation";

import { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData) as User);
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      log("Failed to save auth data:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return { user, loading, login, logout };
};
