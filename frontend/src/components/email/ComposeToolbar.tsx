import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MdAccessTime, MdSend, MdDelete, MdCancel } from "react-icons/md";

interface ComposeToolbarProps {
  onScheduleClick: () => void;
  onDeleteClick: () => void;
  onSendClick: () => void;
  scheduledTime: Date | null;
  hasEmailError?: boolean;
  clearScheduledTime: () => void;
  isSending?: boolean;
  isSaving?: boolean;
}

export function ComposeToolbar({
  onScheduleClick,
  onDeleteClick,
  onSendClick,
  scheduledTime,
  clearScheduledTime,
  hasEmailError = false,
  isSending = false,
}: ComposeToolbarProps) {
  return (
    <div className="flex justify-between items-center border-t p-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onScheduleClick}
          className="flex items-center text-gray-500 hover:text-gray-800"
        >
          <MdAccessTime className="mr-1" />
          Schedule
        </Button>

        {scheduledTime && (
          <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-xs">
            <span className="mr-1">Scheduled:</span>
            <strong>{format(scheduledTime, "MMM d, h:mm a")}</strong>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => clearScheduledTime()}
              className="ml-1 p-0 h-4 w-4 text-blue-600 hover:bg-blue-100"
            >
              <MdCancel size={14} />
            </Button>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDeleteClick}
          className="flex items-center text-gray-500 hover:text-red-600"
        >
          <MdDelete className="mr-1" />
          Delete
        </Button>
      </div>

      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={onSendClick}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled={hasEmailError || isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
