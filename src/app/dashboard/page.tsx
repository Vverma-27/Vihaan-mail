"use client";

import { useSearchParams } from "next/navigation";
import EmailCard from "@/components/EmailCard";
import { useEmailStore } from "@/lib/store/emailStore";
import {
  MdOutlineDrafts,
  MdOutlineSend,
  MdOutlineSearch,
} from "react-icons/md";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "sent"; // Default to sent if no view specified
  const searchQuery = searchParams.get("q") || "";

  const { drafts, sent, filteredEmails } = useEmailStore();

  const renderContent = () => {
    // Use filtered emails if there's a search query, otherwise use regular emails
    let emails = [];
    let title = "";
    let emptyStateIcon = null;
    let emptyStateTitle = "";
    let emptyStateText = "";

    if (filteredEmails !== null && searchQuery) {
      // We're showing filtered results
      emails = filteredEmails;
      title = `Search results for "${searchQuery}"`;
      emptyStateIcon = (
        <MdOutlineSearch className="w-20 h-20 text-gray-300 mb-4" />
      );
      emptyStateTitle = "No results found";
      emptyStateText = `No matches for "${searchQuery}" in ${
        view === "drafts" ? "drafts" : "sent emails"
      }`;
    } else {
      // Regular view (no search)
      if (view === "drafts") {
        emails = drafts;
        title = "Drafts";
        emptyStateIcon = (
          <MdOutlineDrafts className="w-20 h-20 text-gray-300 mb-4" />
        );
        emptyStateTitle = "No drafts found";
        emptyStateText = "Saved drafts will appear here";
      } else {
        // Default to sent
        emails = sent;
        title = "Sent";
        emptyStateIcon = (
          <MdOutlineSend className="w-20 h-20 text-gray-300 mb-4" />
        );
        emptyStateTitle = "No sent emails found";
        emptyStateText = "Emails you send will appear here";
      }
    }

    return (
      <>
        <div className="p-4 border-b">
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>

        {emails && emails.length > 0 ? (
          <div className="divide-y">
            {emails.map((email, index) => (
              <EmailCard
                key={email.id}
                id={email.id}
                to={email.to}
                subject={email.subject || "(No subject)"}
                date={email.timestamp}
                attachments={email.files || []}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            {emptyStateIcon}
            <p className="text-gray-500 text-lg">{emptyStateTitle}</p>
            <p className="text-gray-400 text-sm">{emptyStateText}</p>
          </div>
        )}
      </>
    );
  };

  return <div className="flex-1 h-full overflow-y-auto">{renderContent()}</div>;
}
