import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MdMinimize,
  MdClose,
  MdAttachFile,
  MdDelete,
  MdAccessTime,
  MdCancel,
} from "react-icons/md";
import { useEmailStore } from "@/lib/store/emailStore";
import { AttachmentDisplay } from "./AttachmentDisplay";
import { ScheduleModal } from "./ScheduleModal";
import { ComposeHeader } from "./ComposeHeader";
import { ComposeToolbar } from "./ComposeToolbar";
import { toast } from "sonner";
import {
  useSendEmail,
  useCreateDraft,
  useUpdateDraft,
  useDeleteEmail,
} from "@/hooks/useEmailQueries";

interface ComposeTabProps {
  tabId: string;
}

export function ComposeTab({ tabId }: ComposeTabProps) {
  const {
    getTabById,
    updateTabContent,
    minimizeTab,
    removeComposeTab,
    bringTabToFront,
  } = useEmailStore();

  // React Query mutations
  const sendEmailMutation = useSendEmail();
  const createDraftMutation = useCreateDraft();
  const updateDraftMutation = useUpdateDraft();
  const deleteEmailMutation = useDeleteEmail();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<{
    subject: string;
    body: string;
    to: string;
  } | null>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  const tab = getTabById(tabId);
  if (!tab) return null;

  // Store the original content when the component mounts
  useEffect(() => {
    // Only set original content once when the component mounts
    if (!originalContent && tab) {
      setOriginalContent({
        subject: tab.subject,
        body: tab.body,
        to: tab.to,
      });
    }
  }, [tab, originalContent]);

  // Function to check if content has changed
  const hasContentChanged = () => {
    if (!originalContent) return false;

    // Compare the current tab content to the original content
    return (
      originalContent.subject !== tab.subject ||
      originalContent.body !== tab.body ||
      originalContent.to !== tab.to
    );
  };

  // Email validation regex pattern
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Function to validate a single email address
  const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email.trim());
  };

  // Function to validate multiple email addresses
  const validateEmails = (
    emails: string
  ): { valid: boolean; invalidEmails: string[] } => {
    if (!emails.trim()) {
      return { valid: false, invalidEmails: ["No recipient specified"] };
    }

    // Split by comma and trim each email
    const emailList = emails
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);
    const invalidEmails = emailList.filter((email) => !isValidEmail(email));

    return {
      valid: invalidEmails.length === 0,
      invalidEmails,
    };
  };

  const handleHeaderClick = () => {
    if (tab.minimized) {
      minimizeTab(tabId);
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Determine if the content has been modified
    const hasChanged = hasContentChanged();

    // If it's an existing draft and content changed
    if (tab.isExistingDraft && hasChanged) {
      updateDraftMutation.mutate({
        id: tabId,
        subject: tab.subject,
        body: tab.body,
        to: tab.to,
        scheduledAt: tab.scheduledAt,
      });
    }
    // For new draft - if there's content, save to drafts
    else if (!tab.isExistingDraft && (tab.subject || tab.body || tab.to)) {
      createDraftMutation.mutate({
        id: tabId,
        subject: tab.subject,
        body: tab.body,
        to: tab.to,
        scheduledAt: tab.scheduledAt,
      });
    }
    // Empty tab or no changes, just close it
    else {
      removeComposeTab(tabId);
    }
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeTab(tabId);
  };

  const handleDeleteClick = () => {
    if (tab.isExistingDraft) {
      // If it's an existing draft, delete it using the mutation
      deleteEmailMutation.mutate(
        { id: tabId, type: "draft" },
        {
          onSuccess: () => {
            // Close the compose tab after successful deletion
            removeComposeTab(tabId);
          },
        }
      );
    } else {
      // If it's just a new compose tab, simply remove it
      removeComposeTab(tabId);
    }
  };

  const handleScheduleClick = () => {
    setIsScheduleModalOpen(true);
  };

  const handleScheduleConfirm = (time: Date) => {
    updateTabContent(tabId, { scheduledAt: time });
    setIsScheduleModalOpen(false);
  };

  const handleSendClick = () => {
    // Reset any previous errors
    setEmailError(null);

    // Validate all email addresses
    const { valid, invalidEmails } = validateEmails(tab.to);

    // If email validation fails, show error and don't proceed
    if (!valid) {
      const errorMsg =
        invalidEmails.length === 1 &&
        invalidEmails[0] === "No recipient specified"
          ? "Please specify at least one recipient"
          : `Invalid email address${
              invalidEmails.length > 1 ? "es" : ""
            }: ${invalidEmails.join(", ")}`;

      setEmailError(errorMsg);
      toast.error("Cannot send email", { description: errorMsg });
      return;
    }

    // Check if subject is empty
    if (!tab.subject || tab.subject.trim() === "") {
      const send = confirm("Send this message without a subject?");
      if (!send) return; // User cancelled sending
    }

    // Prepare email data
    const emailData = {
      to: tab.to,
      subject: tab.subject,
      body: tab.body,
      scheduledAt: tab.scheduledAt?.toISOString(),
      draftId: tab.isExistingDraft ? tabId : undefined,
    };

    // Send email using the mutation
    sendEmailMutation.mutate({
      id: tabId,
      data: emailData,
    });
  };

  const handleTabClick = () => {
    if (!tab.minimized) {
      bringTabToFront(tabId);
    }
  };

  // Update the tab content when user edits fields
  const updateSubject = (value: string) => {
    updateTabContent(tabId, { subject: value });
  };

  const updateBody = (value: string) => {
    updateTabContent(tabId, { body: value });
  };

  const updateRecipient = (value: string) => {
    if (emailError) {
      setEmailError(null);
    }
    updateTabContent(tabId, { to: value });
  };

  const updateScheduledTime = (time?: Date) => {
    updateTabContent(tabId, { scheduledAt: time });
  };

  return (
    <>
      <div
        ref={tabRef}
        className="max-w-[100vw] w-[500px] bg-white z-[100] relative rounded-t-lg shadow-lg border border-gray-300 flex flex-col"
        style={{ height: tab.minimized ? "40px" : "500px" }}
        onClick={handleTabClick}
      >
        {/* Header */}
        <ComposeHeader
          subject={tab.subject}
          minimized={tab.minimized}
          onHeaderClick={handleHeaderClick}
          onMinimizeClick={handleMinimizeClick}
          onCloseClick={handleCloseClick}
        />

        {/* Compose Form - only visible when not minimized */}
        {!tab.minimized && (
          <>
            <div className="p-4 flex flex-col flex-grow">
              <div className="border-b pb-2 mb-2">
                <Input
                  type="email"
                  placeholder="Recipient (for multiple recipients, separate with commas)"
                  className={`border-none text-sm focus-visible:ring-0 ${
                    emailError ? "border-red-500 bg-red-50" : ""
                  }`}
                  value={tab.to}
                  onChange={(e) => updateRecipient(e.target.value)}
                />
                {emailError && (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                )}
              </div>
              <div className="border-b pb-2 mb-2">
                <Input
                  type="text"
                  placeholder="Subject"
                  className="border-none text-sm focus-visible:ring-0"
                  value={tab.subject}
                  onChange={(e) => updateSubject(e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Compose email"
                className="flex-grow border-none resize-none focus-visible:ring-0"
                value={tab.body}
                onChange={(e) => updateBody(e.target.value)}
              />
            </div>

            {/* Toolbar */}
            <ComposeToolbar
              onScheduleClick={handleScheduleClick}
              onDeleteClick={handleDeleteClick}
              onSendClick={handleSendClick}
              scheduledTime={tab.scheduledAt || null}
              clearScheduledTime={() => updateScheduledTime(undefined)}
              hasEmailError={Boolean(emailError)}
              isSending={sendEmailMutation.isPending}
              isSaving={
                createDraftMutation.isPending || updateDraftMutation.isPending
              }
            />
          </>
        )}
      </div>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        initialDate={tab.scheduledAt}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
      />
    </>
  );
}
