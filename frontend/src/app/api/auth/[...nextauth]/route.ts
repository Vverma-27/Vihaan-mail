import { NextRequest } from "next/server";
import { handlers as originalHandlers } from "@/auth";

const logRequestDetails = (req: NextRequest, method: string) => {
  const url = req.url;
  const cookieObj = Object.fromEntries(
    req.cookies.getAll().map((cookie) => [cookie.name, cookie.value])
  );
  const searchParams = Object.fromEntries(new URL(req.url).searchParams);

  console.log(`Auth ${method} request:`, {
    timestamp: new Date().toISOString(),
    url,
    cookies: cookieObj,
    searchParams,
    headers: {
      "user-agent": req.headers.get("user-agent"),
      "content-type": req.headers.get("content-type"),
      referer: req.headers.get("referer"),
    },
  });
};

const wrappedHandlers = {
  GET: async (req: NextRequest) => {
    logRequestDetails(req, "GET");
    return originalHandlers.GET(req);
  },
  POST: async (req: NextRequest) => {
    logRequestDetails(req, "POST");
    const clone = req.clone();
    try {
      // Log request body for POST requests if possible
      const body = await clone.json();
      console.log("Auth POST request body:", body);
    } catch (e) {
      // Body might not be JSON or might have been read already
    }
    return originalHandlers.POST(req);
  },
};

export const { GET, POST } = wrappedHandlers;
