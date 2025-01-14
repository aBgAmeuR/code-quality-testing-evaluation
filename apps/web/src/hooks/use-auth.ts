"use client";

import { log } from "@repo/logger";
import { useRouter } from "next/navigation";

import { User } from "../types";
import { useStore } from "~/lib/store";

export const useAuth = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const setToken = useStore((state) => state.setToken);
  const loading = user === null;
  const router = useRouter();

  const login = (token: string, userData: User) => {
    try {
      setToken(token);
      setUser(userData);
    } catch (err) {
      log("Failed to save auth data:", err);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return { user, loading, login, logout };
};
