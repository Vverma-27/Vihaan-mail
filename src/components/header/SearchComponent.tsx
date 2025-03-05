import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";

export function SearchComponent() {
  return (
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
  );
}
