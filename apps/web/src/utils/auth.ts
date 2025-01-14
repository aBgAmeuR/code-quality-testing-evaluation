"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import { useStore } from "~/lib/store";

export const isAuthenticated = () => {
  return useStore((state) => state.token) !== null;
};
