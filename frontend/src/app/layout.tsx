import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/providers/QueryClientProvider";

export const metadata: Metadata = {
  title: "VihaanMail",
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
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
