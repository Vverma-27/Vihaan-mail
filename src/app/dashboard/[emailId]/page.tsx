"use client";

import { notFound } from "next/navigation";
import EmailDetail from "@/components/EmailDetail";
import { useEmailStore } from "@/lib/store/emailStore";

export default function EmailPage({ params }: { params: { emailId: string } }) {
  const { emailId } = params;
  const { drafts, sent } = useEmailStore();

  // Try to find the email in either drafts or sent collections
  let email;
  let emailType;

  // Check if it's a draft (can check by ID prefix if you use prefixes like 'draft-' or 'sent-')
  const foundDraft = drafts.find((draft) => draft.id === emailId);
  if (foundDraft) {
    email = foundDraft;
    emailType = "draft";
  }

  // If not found in drafts, check sent emails
  if (!email) {
    const foundSent = sent.find((sentEmail) => sentEmail.id === emailId);
    if (foundSent) {
      email = foundSent;
      emailType = "sent";
    }
  }

  // If not found in either collection, return 404
  if (!email) {
    return notFound();
  }

  return <EmailDetail email={email} type={emailType} />;
}
