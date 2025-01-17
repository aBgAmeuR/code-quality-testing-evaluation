"use client";

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return true;
  }
  return localStorage.getItem("token") !== null;
};
