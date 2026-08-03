import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matchbokning.se",
  description: "Sveriges marknadsplats för träningsmatcher i fotboll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
