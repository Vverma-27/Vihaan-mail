import { auth, signOut } from "@/auth";
import { LogoComponent } from "./header/LogoComponent";
import { SearchComponent } from "./header/SearchComponent";
import { UserMenu } from "./header/UserMenu";
import { Suspense } from "react";
import { LoadingFallback } from "@/app/dashboard/page";

export default async function Header() {
  const session = await auth();

  return (
    <header className="flex justify-between items-center w-full p-2 bg-white border-b sticky top-0 z-10 px-4">
      <LogoComponent />
      <Suspense fallback={<LoadingFallback />}>
        <SearchComponent />
      </Suspense>
      <UserMenu
        userImage={session!.user?.image || ""}
        userName={session!.user?.name || ""}
      />
    </header>
  );
}
