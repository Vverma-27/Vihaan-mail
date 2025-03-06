import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth } = req;

  console.log("Middleware triggered:", nextUrl.pathname);
  console.log("Auth status:", auth);

  // Redirect unauthenticated users to the homepage
  if (!auth && nextUrl.pathname !== "/") {
    console.log("Redirecting to /");
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Redirect authenticated users from root path (/) to /dashboard
  if (auth && nextUrl.pathname === "/") {
    console.log("Redirecting to /dashboard");
    return NextResponse.redirect(
      new URL("/dashboard?view=sent", nextUrl.origin)
    );
  }

  return NextResponse.next(); // Ensure other requests proceed
});

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Only applies to `/` and `/dashboard/*`
};
