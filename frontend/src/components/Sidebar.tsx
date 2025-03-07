"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiPlus, FiMenu } from "react-icons/fi";
import { MdSend, MdInsertDriveFile, MdClose } from "react-icons/md";
import { SidebarItem } from "@/components/email/SidebarItem";
import { ComposeTab } from "@/components/email/ComposeTab";
import { useEmailStore } from "@/lib/store/emailStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Sidebar() {
  const { composeTabs, addComposeTab, drafts, sent } = useEmailStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Determine which section is active based on query param
  const view = searchParams.get("view") || "sent";

  // Close the sheet on route change for mobile
  useEffect(() => {
    setOpen(false);
  }, [searchParams]);

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
    if (!isDesktop) {
      setOpen(false); // Close drawer after clicking compose on mobile
    }
  };

  const handleSectionClick = (queryParam: string) => {
    router.push(`/dashboard${queryParam}`);
    if (!isDesktop) {
      setOpen(false); // Close drawer after navigation on mobile
    }
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

  const SidebarContent = () => (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-4">
        {!isDesktop && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="md:hidden"
            >
              <MdClose className="h-5 w-5" />
            </Button>
          </div>
        )}
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
  );

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden fixed top-0 left-0 p-2 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <FiMenu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:block w-64 bg-white h-full")}>
        <SidebarContent />
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
