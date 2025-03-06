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

interface ComposeTabProps {
  tabId: string;
}

export function ComposeTab({ tabId }: ComposeTabProps) {
  const {
    getTabById,
    updateSubject,
    updateBody,
    updateRecipient,
    minimizeTab,
    closeTab,
    moveTabToDrafts,
    deleteTab,
    bringTabToFront,
    sendEmail,
  } = useEmailStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<{ [key: string]: number }>({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  const tab = getTabById(tabId);
  if (!tab) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);

      // Simulate upload progress for each file
      newFiles.forEach((file) => {
        const fileId = file.name + Date.now();
        simulateFileUpload(fileId);
      });
    }
  };

  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    setUploading((prev) => ({ ...prev, [fileId]: progress }));

    const interval = setInterval(() => {
      progress += 10;
      setUploading((prev) => ({ ...prev, [fileId]: progress }));

      if (progress >= 100) {
        clearInterval(interval);
        // Keep 100% for a moment, then remove from uploading state
        setTimeout(() => {
          setUploading((prev) => {
            const { [fileId]: _, ...rest } = prev;
            return rest;
          });
        }, 500);
      }
    }, 250);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleHeaderClick = () => {
    if (tab.minimized) {
      minimizeTab(tabId);
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If there's content, save to drafts
    if (tab.subject || tab.body || tab.to || files.length > 0) {
      moveTabToDrafts(tabId);
    } else {
      closeTab(tabId);
    }
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeTab(tabId);
  };

  const handleDeleteClick = () => {
    deleteTab(tabId);
  };

  const handleScheduleClick = () => {
    setIsScheduleModalOpen(true);
  };

  const handleScheduleConfirm = (time: Date) => {
    setScheduledTime(time);
    setIsScheduleModalOpen(false);
  };

  const handleSendClick = () => {
    if (scheduledTime) {
      // In a real app, you would save this to be sent at the scheduled time
      console.log(`Email scheduled to be sent at: ${scheduledTime}`);

      // For demo purposes, we'll just send it immediately
      sendEmail(tabId);
    } else {
      sendEmail(tabId);
    }
    closeTab(tabId);
  };

  const handleTabClick = () => {
    if (!tab.minimized) {
      bringTabToFront(tabId);
    }
  };

  return (
    <>
      <div
        ref={tabRef}
        className="w-[500px] bg-white rounded-t-lg shadow-lg border border-gray-300 flex flex-col"
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
                  type="text"
                  placeholder="Recipients"
                  className="border-none text-sm focus-visible:ring-0"
                  value={tab.to}
                  onChange={(e) => updateRecipient(tabId, e.target.value)}
                />
              </div>
              <div className="border-b pb-2 mb-2">
                <Input
                  type="text"
                  placeholder="Subject"
                  className="border-none text-sm focus-visible:ring-0"
                  value={tab.subject}
                  onChange={(e) => updateSubject(tabId, e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Compose email"
                className="flex-grow border-none resize-none focus-visible:ring-0"
                value={tab.body}
                onChange={(e) => updateBody(tabId, e.target.value)}
              />

              {/* Attachments */}
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <AttachmentDisplay
                      key={index}
                      file={file}
                      progress={uploading[file.name + Date.now()] || null}
                      onRemove={() => removeFile(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Toolbar */}
            <ComposeToolbar
              onAttachClick={() => fileInputRef.current?.click()}
              onScheduleClick={handleScheduleClick}
              onDeleteClick={handleDeleteClick}
              onSendClick={handleSendClick}
              scheduledTime={scheduledTime}
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </>
        )}
      </div>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
      />
    </>
  );
}
