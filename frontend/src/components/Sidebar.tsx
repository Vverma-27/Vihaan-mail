"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { MdSend, MdInsertDriveFile } from "react-icons/md";
import { SidebarItem } from "@/components/email/SidebarItem";
import { ComposeTab } from "@/components/email/ComposeTab";
import { useEmailStore } from "@/lib/store/emailStore";
import { useRouter, useSearchParams } from "next/navigation";

export default function Sidebar() {
  const { composeTabs, addComposeTab, drafts, sent } = useEmailStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine which section is active based on query param
  const view = searchParams.get("view") || "sent";

  const sidebarItems = [
    {
      icon: <MdSend />,
      label: "Sent",
      count: sent?.length || 0,
      active: view === "sent" || !view,
      queryParam: "?view=sent",
    },
    {
      icon: <MdInsertDriveFile />,
      label: "Drafts",
      count: drafts?.length || 0,
      active: view === "drafts",
      queryParam: "?view=drafts",
    },
  ];

  const handleComposeClick = () => {
    addComposeTab();
  };

  const handleSectionClick = (queryParam: string) => {
    router.push(`/dashboard${queryParam}`);
  };

  // Calculate horizontal offset for each compose tab
  const getTabStyle = (index: number) => {
    // Limit the maximum offset to prevent tabs from going off-screen
    const maxOffset = Math.min(index * 20, 80);
    return {
      right: `${maxOffset}px`,
      zIndex: 100 - index, // Higher index tabs have lower z-index
    };
  };

  return (
    <>
      <div className="w-64 bg-white h-full flex flex-col">
        <div className="p-4">
          <Button
            variant="outline"
            onClick={handleComposeClick}
            className="rounded-2xl px-6 py-3 h-14 shadow-md text-gray-700 bg-white border hover:shadow-lg w-full justify-start items-center"
          >
            <FiPlus size={20} className="mr-1" />
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
                onClick={() => handleSectionClick(item.queryParam)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Compose Email Tabs */}
      <div className="fixed bottom-0 right-0 flex gap-4 pr-4 z-[100]">
        {composeTabs.map((tab, index) => (
          <div
            key={tab.id}
            className="absolute bottom-0 z-[100]"
            style={getTabStyle(index)}
          >
            <ComposeTab tabId={tab.id} />
          </div>
        ))}
      </div>
    </>
  );
}
