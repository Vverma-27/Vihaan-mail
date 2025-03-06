import { Button } from "@/components/ui/button";
import { MdAttachFile, MdAccessTime, MdDelete } from "react-icons/md";
import { format } from "date-fns";

interface ComposeToolbarProps {
  onAttachClick: () => void;
  onScheduleClick: () => void;
  onDeleteClick: () => void;
  onSendClick: () => void;
  scheduledTime: Date | null;
}

export function ComposeToolbar({
  onAttachClick,
  onScheduleClick,
  onDeleteClick,
  onSendClick,
  scheduledTime,
}: ComposeToolbarProps) {
  return (
    <div className="px-4 py-2 border-t border-gray-200 flex flex-col">
      {scheduledTime && (
        <div className="mb-2 text-xs text-gray-600 bg-gray-100 p-2 rounded flex justify-between items-center">
          <span>Scheduled to send at: {format(scheduledTime, "PPp")}</span>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            Edit
          </Button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Button
            onClick={onSendClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {scheduledTime ? "Schedule" : "Send"}
          </Button>
        </div>
        <div className="flex space-x-3 text-gray-600">
          <button className="hover:text-gray-900" onClick={onAttachClick}>
            <MdAttachFile size={20} />
          </button>
          <button className="hover:text-gray-900" onClick={onScheduleClick}>
            <MdAccessTime size={20} />
          </button>
          <button className="hover:text-gray-900" onClick={onDeleteClick}>
            <MdDelete size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
