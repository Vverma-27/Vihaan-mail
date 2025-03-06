import { MdMinimize, MdClose } from "react-icons/md";

interface ComposeHeaderProps {
  subject: string;
  minimized: boolean;
  onHeaderClick: () => void;
  onMinimizeClick: (e: React.MouseEvent) => void;
  onCloseClick: (e: React.MouseEvent) => void;
}

export function ComposeHeader({
  subject,
  minimized,
  onHeaderClick,
  onMinimizeClick,
  onCloseClick,
}: ComposeHeaderProps) {
  return (
    <div
      className="bg-gray-800 text-white px-3 py-2 rounded-t-lg flex justify-between items-center cursor-pointer"
      onClick={onHeaderClick}
    >
      <div className="text-sm font-medium truncate">
        {subject ? subject : "New Message"}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onMinimizeClick}
          className="hover:bg-gray-700 p-1 rounded"
        >
          <MdMinimize size={16} />
        </button>
        <button
          onClick={onCloseClick}
          className="hover:bg-gray-700 p-1 rounded"
        >
          <MdClose size={16} />
        </button>
      </div>
    </div>
  );
}
