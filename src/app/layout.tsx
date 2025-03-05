import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "VMail",
  description: "Email app with scheduling and sending features.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 ">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
