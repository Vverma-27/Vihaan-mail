import { notFound } from "next/navigation";
import EmailDetail from "@/components/EmailDetail";
import { emails } from "@/lib/data"; // We'll create this to store sample data

export default function EmailPage({ params }: { params: { emailId: string } }) {
  const email = emails.find((email) => email.id === params.emailId);

  if (!email) {
    return notFound();
  }

  return <EmailDetail email={email} />;
}
