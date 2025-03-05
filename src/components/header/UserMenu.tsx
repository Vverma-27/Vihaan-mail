"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  userImage: string;
  userName: string;
}

export function UserMenu({ userImage, userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    signOut();
  };

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center ml-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0 h-auto w-auto">
            <Avatar className="cursor-pointer">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 p-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{userName}</p>
              </div>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
