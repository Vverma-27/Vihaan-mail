import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { LoadingFallback } from "./page";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Sidebar />
        </Suspense>
        <main className="flex-grow p-6 max-w-[100vw] bg-white">{children}</main>
      </div>
    </div>
  );
}
