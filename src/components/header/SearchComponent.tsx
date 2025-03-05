"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEmailStore } from "@/lib/store/emailStore";

export function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { setFilteredEmails } = useEmailStore();

  // Get the current view from URL params (default to sent)
  const currentView = searchParams.get("view") || "sent";

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Create new search params with the query
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    // Update URL without refreshing the page
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Filter emails when search query or view changes
  useEffect(() => {
    // Get the current search query from URL
    const query = searchParams.get("q") || "";
    setSearchQuery(query);

    if (query) {
      filterEmails(query, currentView);
    } else {
      // Clear filtered results if no query
      setFilteredEmails(null);
    }
  }, [searchParams, currentView, setFilteredEmails]);

  // Function to filter emails based on query and current view
  const filterEmails = (query: string, view: string) => {
    const { drafts, sent } = useEmailStore.getState();

    const emailsToSearch = view === "drafts" ? drafts : sent;

    if (!query.trim()) {
      setFilteredEmails(null);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Search in subject, body, and recipient
    const filtered = emailsToSearch.filter(
      (email) =>
        email.subject?.toLowerCase().includes(lowerQuery) ||
        email.to?.toLowerCase().includes(lowerQuery)
    );

    setFilteredEmails(filtered);
  };

  return (
    <div className="flex-grow max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoSearchOutline className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder={`Search ${
            currentView === "drafts" ? "drafts" : "sent emails"
          }`}
          className="pl-10 py-1.5 bg-gray-100 hover:bg-white hover:shadow-md focus:bg-white focus:shadow-md w-full rounded-lg border-none"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}
