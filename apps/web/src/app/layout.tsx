"use client";

/* eslint-disable turbo/no-undeclared-env-vars -- process.env variables are used in this file */
import type { JSX } from "react";

import { log } from "@repo/logger";
import "@repo/ui/globals.css";

declare global {
  interface Window {
    AnimationEffectAPP_VERSION: string;
    DEBUG: boolean;
    API_URL: string;
  }

  interface NodeModule {
    hot: {
      accept(path: string, callback: () => void): void;
    };
  }
}

window.onerror = function handleGlobalError(
  message,
  source,
  lineno,
  colno,
  error
) {
  log("Global error:", { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = function handleUnhandledRejection(event) {
  log("Unhandled promise rejection:", event.reason);
};

const isDev = process.env.NODE_ENV === "development";

window.AnimationEffectAPP_VERSION = "1.0.0";
window.DEBUG = isDev;

window.API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
