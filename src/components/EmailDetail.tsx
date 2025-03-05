import React from "react";
import { format } from "date-fns";
import { Email } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Reply,
  Forward,
  Star,
  Archive,
  Delete,
  MoreHorizontal,
  Paperclip,
} from "lucide-react";

interface EmailDetailProps {
  email: Email;
}

export default function EmailDetail({ email }: EmailDetailProps) {
  const formattedDate = format(new Date(email.date), "MMM d, yyyy, h:mm a");

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-xl font-medium">{email.subject}</div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Archive className="h-4 w-4 mr-1" />
            Archive
          </Button>
          <Button variant="ghost" size="sm">
            <Delete className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={email.sender.avatar} />
              <AvatarFallback>{email.sender.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-medium">{email.sender.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  &lt;{email.sender.email}&gt;
                </span>
              </div>
              <div className="text-gray-500 text-sm">to {email.recipient}</div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">{formattedDate}</span>
            <Button variant="ghost" size="sm" className="p-1">
              <Star
                className={`h-4 w-4 ${
                  email.starred ? "text-yellow-400 fill-yellow-400" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow whitespace-pre-wrap">{email.body}</div>

      {email.attachments && email.attachments.length > 0 && (
        <div className="p-4 border-t">
          <div className="font-medium mb-2">
            Attachments ({email.attachments.length})
          </div>
          <div className="flex flex-wrap gap-4">
            {email.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center p-2 border rounded-md"
              >
                <Paperclip className="h-4 w-4 mr-2" />
                <div>
                  <div className="text-sm font-medium">{attachment.name}</div>
                  <div className="text-xs text-gray-500">{attachment.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex space-x-2 text-white">
          <Button variant="outline" className="text-sm">
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
          <Button variant="outline" className="text-sm">
            <Forward className="h-4 w-4 mr-1" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}
