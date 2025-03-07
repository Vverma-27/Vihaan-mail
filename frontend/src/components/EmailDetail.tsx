"use client";
import React from "react";
import { formatDistanceToNow, format, isFuture } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEmailStore } from "@/lib/store/emailStore";
import { toast } from "sonner";

interface EmailDetailProps {
  email: {
    id: string;
    subject: string;
    body: string;
    to?: string;
    timestamp: Date;
    scheduledAt?: Date;
  };
  type: "draft" | "sent";
}

export default function EmailDetail({ email, type }: EmailDetailProps) {
  const router = useRouter();
  const { deleteMail } = useEmailStore();

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    // Store the redirect path
    const redirectPath = `/dashboard${
      type === "draft" ? "?view=drafts" : "?view=sent"
    }`;

    try {
      // Store the email ID before deletion
      const emailId = email.id;

      // Navigate first to avoid 404
      router.push(redirectPath);

      // Delete after navigation starts
      // Delete based on the email type
      await deleteMail(emailId, type === "draft");

      // Show a toast notification
      toast.success(`${type === "draft" ? "Draft" : "Email"} deleted`, {
        description: `The ${
          type === "draft" ? "draft" : "email"
        } has been successfully deleted.`,
      });
    } catch (error) {
      // Handle any errors
      toast.error("Error deleting email", {
        description: "There was a problem deleting your email.",
      });
      console.error("Error deleting email:", error);
    }
  };

  // Determine recipient or sender based on email type
  const displayName = `To: ${email.to}`;

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(email.timestamp), {
    addSuffix: true,
  });

  // Check if email is scheduled for future delivery
  const isScheduled =
    email.scheduledAt && isFuture(new Date(email.scheduledAt));

  // Format scheduled time if it exists and is in the future
  const scheduledTime = isScheduled
    ? formatDistanceToNow(new Date(email.scheduledAt as Date), {
        addSuffix: true,
      })
    : null;

  // Format exact scheduled time for tooltip
  const exactScheduledTime = isScheduled
    ? format(new Date(email.scheduledAt as Date), "PPpp") // e.g., "Apr 20, 2023, 3:30 PM"
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Email header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-xl font-semibold">
            {email.subject || "(No subject)"}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            title="Delete"
            onClick={handleDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scheduled delivery banner - only show if scheduled for future */}
      {isScheduled && (
        <div className="bg-blue-50 px-4 py-2 flex items-center text-sm border-b">
          <Clock className="h-4 w-4 text-blue-500 mr-2" />
          <span title={exactScheduledTime || ""}>
            To be sent <strong>{scheduledTime}</strong>
          </span>
        </div>
      )}

      {/* Email metadata */}
      <div className="p-4 border-b">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">{displayName}</p>
            {type === "draft" && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                Draft
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* Email body */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="prose max-w-none">
          {email.body ? (
            <div dangerouslySetInnerHTML={{ __html: email.body }} />
          ) : (
            <p className="text-gray-500 italic">(No content)</p>
          )}
        </div>
      </div>
    </div>
  );
}
