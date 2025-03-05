import { notFound } from "next/navigation";
import EmailDetail from "@/components/EmailDetail";
import { emails } from "@/lib/data"; // We'll create this to store sample data

export default async function EmailPage({
  params: compParams,
}: {
  params: Promise<{ emailId: string }>;
}) {
  const params = await compParams;
  if (!params?.emailId) {
    return notFound();
  }
  const email = emails.find((email) => email.id === params.emailId);

  if (!email) {
    return notFound();
  }

  return <EmailDetail email={email} />;
}
