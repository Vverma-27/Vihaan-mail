import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailCardProps {
  id: string;
  subject: string;
  date: Date;
  attachments?: File[];
  index: number;
  to: string;
}

export default function EmailCard({
  id,
  subject,
  date,
  to,
  attachments,
  index,
}: EmailCardProps) {
  return (
    <Link href={`/dashboard/${id}`}>
      <div
        className={
          "flex items-center px-4 py-2 cursor-pointer border-b hover:shadow-md transition-shadow"
        }
      >
        <div className="flex items-center w-full">
          <div className="flex items-center min-w-[180px]">
            <div className="flex items-center mr-3">
              {/* Status indicator dot */}
              <div className={"w-2 h-2 rounded-full mr-2 bg-gray-300"}></div>

              {/* Email number */}
              <span className="text-xs text-gray-500">{index + 1}</span>
            </div>

            <div className={"truncate"}>{to}</div>
          </div>

          <div className="flex-grow truncate">
            <span className={"mr-1"}>{subject}</span>
            {attachments && attachments.length > 0 && (
              <Paperclip className="inline h-4 w-4 text-gray-400" />
            )}
          </div>

          <div className="ml-4 text-sm text-gray-500 whitespace-nowrap">
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        </div>
      </div>
    </Link>
  );
}
