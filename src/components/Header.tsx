import { FiMenu } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { MdSettings, MdApps } from "react-icons/md";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();
  console.log(session!.user?.image);
  return (
    <header className="flex justify-between items-center w-full p-2 bg-white border-b sticky top-0 z-10 px-4">
      <div className="flex items-center mr-4">
        <div className="flex items-center">
          <span className="text-xl font-black text-gray-600">V-Mail</span>
        </div>
      </div>

      <div className="flex-grow max-w-2xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearchOutline className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search mail"
            className="pl-10 py-1.5 bg-gray-100 hover:bg-white hover:shadow-md focus:bg-white focus:shadow-md w-full rounded-lg border-none"
          />
        </div>
      </div>

      <div className="flex items-center ml-4 space-x-2">
        <Avatar>
          <AvatarImage src={session!.user?.image || ""} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
