import { MdCancel } from "react-icons/md";
import { Progress } from "@/components/ui/progress";

interface AttachmentDisplayProps {
  file: File;
  progress: number | null;
  onRemove: () => void;
}

export function AttachmentDisplay({
  file,
  progress,
  onRemove,
}: AttachmentDisplayProps) {
  return (
    <div className="flex items-center justify-between bg-gray-100 rounded p-2">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <span className="text-sm truncate max-w-[300px]">{file.name}</span>
          <button
            onClick={onRemove}
            className="text-gray-600 hover:text-gray-900"
          >
            <MdCancel size={16} />
          </button>
        </div>
        {progress !== null && (
          <Progress value={progress} className="h-1 mt-1" />
        )}
      </div>
    </div>
  );
}
