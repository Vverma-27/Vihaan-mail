import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Paperclip,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEmailStore } from "@/lib/store/emailStore";
import {
  convertApiEmail,
  emailKeys,
  useDeleteEmail,
  useEmailById,
} from "@/hooks/useEmailQueries";
import { useQueryClient } from "@tanstack/react-query";
import emailApi from "@/lib/api";

interface EmailCardProps {
  id: string;
  subject: string;
  date: Date;
  attachments?: File[];
  index: number;
  to: string;
  status?: "processed" | "failed" | "pending";
  type?: "draft" | "sent";
}

export default function EmailCard({
  id,
  subject,
  date,
  status,
  to,
  attachments,
  index,
  type = "sent",
}: EmailCardProps) {
  const queryClient = useQueryClient();
  const [isHovering, setIsHovering] = useState(false);
  const { addComposeTab } = useEmailStore();
  const router = useRouter();

  // Use React Query hooks
  const deleteEmailMutation = useDeleteEmail();

  // Process recipient email addresses
  const processRecipients = () => {
    if (!to) return { primaryRecipient: "", additionalCount: 0 };

    // Split by comma and trim each email
    const recipients = to
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    // If there's only one recipient or none, return it without a badge
    if (recipients.length <= 1) {
      return { primaryRecipient: recipients[0] || "", additionalCount: 0 };
    }

    // Otherwise, return the first recipient and the count of additional recipients
    return {
      primaryRecipient: recipients[0],
      additionalCount: recipients.length - 1,
    };
  };

  const { primaryRecipient, additionalCount } = processRecipients();

  // Render different status indicators based on the status prop
  const renderStatusIcon = () => {
    if (!status) return null;

    switch (status) {
      case "processed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the email detail page
    e.stopPropagation();

    deleteEmailMutation.mutate({ id, type });
  };

  const handleCardClick = async () => {
    if (type === "draft") {
      try {
        // Prefetch the email data
        const email = await queryClient.fetchQuery({
          queryKey: emailKeys.detail(id),
          queryFn: async () => {
            const email = await emailApi.getEmailById(id);
            return convertApiEmail(email);
          },
        });

        if (email) {
          // Add a compose tab with the draft content
          addComposeTab({
            existingDraftId: id,
            subject: email.subject || "",
            body: email.body || "",
            to: email.to || "",
            scheduledAt: email.scheduledAt
              ? new Date(email.scheduledAt)
              : undefined,
          });
        }
      } catch (error) {
        console.error("Error opening draft:", error);
      }
    } else {
      // For sent emails, navigate to the detail page
      router.push(`/dashboard/${id}`);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center px-4 py-2 cursor-pointer border-b hover:shadow-md transition-shadow relative",
        type === "draft" ? "hover:bg-blue-50" : "hover:bg-gray-50"
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center w-full">
        <div className="flex items-center min-w-[180px]">
          <div className="flex items-center mr-3">
            {/* Status indicator dot */}
            <div
              className={cn(
                "w-2 h-2 rounded-full mr-2",
                status === "processed"
                  ? "bg-green-500"
                  : status === "failed"
                  ? "bg-red-500"
                  : status === "pending"
                  ? "bg-amber-500"
                  : "bg-gray-300"
              )}
            ></div>

            {/* Email number */}
            <span className="text-xs text-gray-500">{index + 1}</span>
          </div>

          <div className="truncate flex items-center mr-6">
            <span className="mr-1">
              {type === "draft" ? "To: " : ""}
              {primaryRecipient}
            </span>

            {/* Additional recipients badge */}
            {additionalCount > 0 && (
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                +{additionalCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex-grow truncate">
          <span className="mr-1">{subject || "(No subject)"}</span>
          {attachments && attachments.length > 0 && (
            <Paperclip className="inline h-4 w-4 text-gray-400" />
          )}
        </div>

        <div className="ml-4 flex items-center space-x-2 whitespace-nowrap">
          {renderStatusIcon()}
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Delete icon that appears on hover */}
      {isHovering && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-100"
            onClick={handleDelete}
            aria-label="Delete"
            disabled={deleteEmailMutation.isPending}
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </Button>
        </div>
      )}
    </div>
  );
}
