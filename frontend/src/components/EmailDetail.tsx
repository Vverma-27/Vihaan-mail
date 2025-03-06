import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Reply,
  Forward,
  Star,
  Paperclip,
  Trash2,
  Archive,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEmailStore } from "@/lib/store/emailStore";
import { toast } from "sonner";

interface EmailDetailProps {
  email: {
    id: string;
    subject: string;
    body: string;
    to?: string;
    sender?: { name: string; email: string };
    timestamp: Date;
    files?: File[];
  };
  type: "draft" | "sent";
}

export default function EmailDetail({ email, type }: EmailDetailProps) {
  const router = useRouter();
  const { deleteDraft, deleteSent } = useEmailStore();

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
      setTimeout(() => {
        // Delete based on the email type
        if (type === "draft") {
          deleteDraft(emailId);
        } else {
          deleteSent(emailId);
        }

        // Show a toast notification
        toast.success(`${type === "draft" ? "Draft" : "Email"} deleted`, {
          description: `The ${
            type === "draft" ? "draft" : "email"
          } has been successfully deleted.`,
        });
      }, 100);
    } catch (error) {
      // Handle any errors
      toast.error("Error deleting email", {
        description: "There was a problem deleting your email.",
      });
      console.error("Error deleting email:", error);
    }
  };
  // Determine recipient or sender based on email type
  const displayName = type === "draft" ? `To: ${email.to}` : `To: ${email.to}`;

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(email.timestamp), {
    addSuffix: true,
  });

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

        {/* Attachments */}
        {email.files && email.files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Attachments</h3>
            <div className="flex flex-wrap gap-2">
              {email.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 border rounded-md"
                >
                  <span className="truncate max-w-xs">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
