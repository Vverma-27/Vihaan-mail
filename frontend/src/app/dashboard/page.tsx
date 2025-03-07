import { Suspense } from "react";
import EmailDashboard from "@/components/EmailDashboard";

// Loading fallback for Suspense
export function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Main Dashboard component that wraps the client component with Suspense
export default function Dashboard() {
  return (
    <div className="flex-1 h-full overflow-y-auto">
      <Suspense fallback={<LoadingFallback />}>
        <EmailDashboard />
      </Suspense>
    </div>
  );
}
