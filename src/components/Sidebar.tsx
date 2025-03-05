"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import {
  MdInbox,
  MdStar,
  MdSend,
  MdInsertDriveFile,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { SidebarItem } from "@/components/email/SidebarItem";
import { ComposeTab } from "@/components/email/ComposeTab";
import { useEmailStore } from "@/lib/store/emailStore";

interface Email {
  id: string;
  subject: string;
  body: string;
  to: string;
  timestamp: Date;
  files?: File[];
}

export default function Sidebar() {
  const { composeTabs, addComposeTab, drafts } = useEmailStore();

  const sidebarItems = [
    { icon: <MdSend />, label: "Sent", count: 0, active: false },
    {
      icon: <MdInsertDriveFile />,
      label: "Drafts",
      count: drafts.length,
      active: false,
    },
  ];

  const handleComposeClick = () => {
    addComposeTab();
  };

  return (
    <>
      <div className="w-64 bg-white h-full flex flex-col">
        <div className="p-4">
          <Button
            variant="outline"
            onClick={handleComposeClick}
            className="rounded-2xl px-6 py-3 h-14 shadow-md text-gray-700 bg-white border hover:shadow-lg w-full justify-start"
          >
            <FiPlus size={20} className="mr-4" />
            <span className="text-sm font-medium">Compose</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 px-2">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                label={item.label}
                count={item.count}
                active={item.active}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Compose Email Tabs */}
      <div className="fixed bottom-0 right-0 flex flex-row-reverse gap-4 pr-4">
        {composeTabs.map((tab) => (
          <ComposeTab key={tab.id} tabId={tab.id} />
        ))}
      </div>
    </>
  );
}
