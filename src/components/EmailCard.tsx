import Link from "next/link";
import { Email } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Star, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailCardProps extends Email {}

export default function EmailCard({
  id,
  subject,
  sender,
  date,
  read,
  starred,
  attachments,
}: EmailCardProps) {
  return (
    <Link href={`/dashboard/${id}`}>
      <div
        className={cn(
          "flex items-center px-4 py-2 cursor-pointer border-b hover:shadow-md transition-shadow",
          !read && "font-semibold bg-blue-50"
        )}
      >
        <div className="flex items-center w-full">
          <div className="flex items-center min-w-[180px]">
            <button className="mr-2 focus:outline-none">
              <Star
                className={cn(
                  "h-5 w-5 text-gray-400",
                  starred && "text-yellow-400 fill-yellow-400"
                )}
              />
            </button>
            <div className="truncate font-medium">{sender.name}</div>
          </div>

          <div className="flex-grow truncate">
            <span className="mr-1">{subject}</span>
            {attachments && attachments.length > 0 && (
              <Paperclip className="inline h-4 w-4 text-gray-400" />
            )}
          </div>

          <div className="ml-4 text-sm text-gray-500 whitespace-nowrap">
            {formatDate(date)}
          </div>
        </div>
      </div>
    </Link>
  );
}
