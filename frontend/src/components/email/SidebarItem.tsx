import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  icon,
  label,
  count,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start rounded-r-full rounded-l-none pl-6 mb-1 ${
        active ? "bg-blue-100 font-medium text-blue-700" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <span className="text-xl mr-4">{icon}</span>
          <span>{label}</span>
        </div>
        {count > 0 && (
          <span className="bg-blue-600 text-white text-xs px-2 rounded-full">
            {count}
          </span>
        )}
      </div>
    </Button>
  );
}
