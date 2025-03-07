"use client";

import { useEffect, useState } from "react";
import { useEmailStore } from "@/lib/store/emailStore";
import EmailDetail from "@/components/EmailDetail";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function EmailDetailClient({ emailId }: { emailId: string }) {
  const { currentEmail, fetchEmailById, loading } = useEmailStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get type from query params or try to determine from cached data
  const typeFromParams = searchParams.get("type") as "draft" | "sent" | null;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // If type is provided in the URL, use that
        if (typeFromParams) {
          await fetchEmailById(emailId, typeFromParams);
        } else {
          // Otherwise try both types (first sent, then draft)
          try {
            await fetchEmailById(emailId, "sent");
          } catch (sentError) {
            try {
              await fetchEmailById(emailId, "draft");
            } catch (draftError) {
              // If both fail, show error
              throw new Error("Email not found");
            }
          }
        }
      } catch (err) {
        console.error("Error loading email:", err);
        setError("Failed to load email");
        toast.error("Failed to load email", {
          description:
            "The email could not be found or there was an error loading it.",
        });

        // Redirect back to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmail();
  }, [emailId, typeFromParams, fetchEmailById, router]);

  // Show loading state
  if (isLoading || loading.current) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error || !currentEmail) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-red-500 text-lg mb-4">
          {error || "Email not found"}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Determine email type for the EmailDetail component
  const emailType = currentEmail.type as "draft" | "sent";

  return (
    <EmailDetail
      email={{
        id: emailId,
        subject: currentEmail.subject || "",
        body: currentEmail.body || "",
        to: currentEmail.to || "",
        scheduledAt: new Date(currentEmail.scheduledAt || ""),
        timestamp: new Date(currentEmail.createdAt),
      }}
      type={emailType}
    />
  );
}
