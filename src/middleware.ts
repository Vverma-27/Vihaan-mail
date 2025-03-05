import { auth } from "@/auth";

export default auth((req) => {
  // If not authenticated and trying to access protected routes, redirect to login (/)
  if (!req.auth && req.nextUrl.pathname !== "/") {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // If authenticated and trying to access root path (/), redirect to dashboard
  if (req.auth && req.nextUrl.pathname === "/") {
    const newUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
