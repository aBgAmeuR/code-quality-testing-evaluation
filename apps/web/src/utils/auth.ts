"use client";

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};
