import EmailCard from "@/components/EmailCard";
import { emails } from "@/lib/data";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sent Emails</h1>
      <div className="grid grid-cols-1 gap-4">
        {emails.map((email) => (
          <EmailCard key={email.id} {...email} />
        ))}
      </div>
    </div>
  );
}
