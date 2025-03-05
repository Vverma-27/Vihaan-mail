import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Minimize, ArrowUpRight } from "lucide-react";

interface ComposeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  initialDraft?: {
    to: string;
    subject: string;
    body: string;
  };
}

export default function ComposeDialog({
  isOpen,
  onClose,
  onMinimize,
  initialDraft,
}: ComposeDialogProps) {
  const [to, setTo] = useState(initialDraft?.to || "");
  const [subject, setSubject] = useState(initialDraft?.subject || "");
  const [body, setBody] = useState(initialDraft?.body || "");
  const [minimized, setMinimized] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        // Save as draft instead of closing
        handleSaveAsDraft();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = () => {
    // Here you would implement sending the email
    console.log("Sending email:", { to, subject, body });
    onClose();
  };

  const handleSaveAsDraft = () => {
    if (to || subject || body) {
      console.log("Saving draft:", { to, subject, body });
      // Here you would save the draft
    }
    onClose();
  };

  const handleMinimize = () => {
    setMinimized(true);
    onMinimize();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed right-6 bottom-0 w-[500px] bg-white rounded-t-lg shadow-xl flex flex-col"
      style={{ height: minimized ? "48px" : "500px" }}
    >
      {/* Header */}
      <div
        className="bg-gray-800 text-white px-4 py-2 rounded-t-lg flex justify-between items-center cursor-pointer"
        onClick={() => (minimized ? setMinimized(false) : null)}
      >
        <h3 className="text-sm font-medium">
          {subject ? subject : "New Message"}
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={handleMinimize}
          >
            <Minimize className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={handleSaveAsDraft}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content - only shown when not minimized */}
      {!minimized && (
        <>
          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-3 border-b pb-2">
              <Input
                type="text"
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border-none focus:ring-0 px-2 py-1"
              />
            </div>
            <div className="mb-3 border-b pb-2">
              <Input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-none focus:ring-0 px-2 py-1"
              />
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex-1 resize-none border-none focus:ring-0 outline-none p-2"
              placeholder="Write your message here..."
            />
          </div>

          <div className="p-3 border-t flex justify-between">
            <Button onClick={handleSend}>Send</Button>
            <Button variant="ghost" size="sm" onClick={handleSaveAsDraft}>
              Save as draft
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
