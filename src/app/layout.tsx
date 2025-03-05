import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-gray-100 text-black">{children}</body>
    </html>
  );
}
