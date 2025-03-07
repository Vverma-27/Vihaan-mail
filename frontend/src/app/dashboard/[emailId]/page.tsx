import { notFound } from "next/navigation";
import EmailDetailClient from "@/components/EmailDetailClient";

export default async function EmailPage({
  params,
}: {
  params: Promise<{ emailId: string }>;
}) {
  const { emailId } = await params;

  return <EmailDetailClient emailId={emailId} />;
}
