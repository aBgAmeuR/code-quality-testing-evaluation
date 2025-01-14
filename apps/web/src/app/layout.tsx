import type { JSX } from "react";
import "@repo/ui/globals.css";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
