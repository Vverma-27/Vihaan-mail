"use client";

import { useEffect, useState } from "react";
import { useEmailStore } from "@/lib/store/emailStore";
import EmailDetail from "@/components/EmailDetail";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEmailById } from "@/hooks/useEmailQueries";

export default function EmailDetailClient({ emailId }: { emailId: string }) {
  const { currentEmail } = useEmailStore();
  const router = useRouter();

  // Use React Query for fetching
  const { isLoading, isError } = useEmailById(emailId);

  // Handle persistent error state
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load email", {
        description:
          "The email could not be found or there was an error loading it.",
      });

      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }, [isError, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (isError && !currentEmail) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-red-500 text-lg mb-4">Email not found</div>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!currentEmail) {
    return null; // This should not happen but added for type safety
  }

  return (
    <EmailDetail
      email={{
        id: emailId,
        subject: currentEmail.subject || "",
        body: currentEmail.body || "",
        to: currentEmail.to || "",
        scheduledAt: currentEmail.scheduledAt
          ? new Date(currentEmail.scheduledAt)
          : undefined,
        timestamp: new Date(currentEmail.createdAt),
      }}
      type={currentEmail.type as "draft" | "sent"}
    />
  );
}
