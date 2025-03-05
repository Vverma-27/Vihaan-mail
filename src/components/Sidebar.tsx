import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import {
  MdInbox,
  MdStar,
  MdAccessTime,
  MdSend,
  MdInsertDriveFile,
  MdKeyboardArrowDown,
  MdLabel,
} from "react-icons/md";

export default function Sidebar() {
  const sidebarItems = [
    { icon: <MdSend />, label: "Sent", count: 0, active: false },
    { icon: <MdInsertDriveFile />, label: "Drafts", count: 2, active: false },
  ];

  return (
    <div className="w-64 bg-white h-full flex flex-col">
      <div className="p-4">
        <Button className="rounded-2xl px-6 py-3 h-14 shadow-md text-gray-700 bg-white border hover:shadow-lg w-full justify-start">
          <FiPlus size={20} className="mr-4" />
          <span className="text-sm font-medium">Compose</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 px-2">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start rounded-r-full rounded-l-none pl-6 mb-1 ${
                item.active ? "bg-blue-100 font-medium text-blue-700" : ""
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-xl mr-4">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="px-5 mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Labels</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MdKeyboardArrowDown />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
