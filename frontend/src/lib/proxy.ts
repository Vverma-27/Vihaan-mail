import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://backend:4000/api";

export async function proxyRequest(
  req: NextRequest,
  path: string,
  options?: {
    headers?: Record<string, string>;
  }
) {
  try {
    const url = `${BACKEND_URL}${path}`;
    const method = req.method;

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
      Authorization: req.headers.get("Authorization") || "",
    };
    // Get request body if it exists
    let body = null;
    if (method !== "GET" && method !== "HEAD") {
      body = await req.json().catch(() => null);
    }
    // Make the request to the backend
    const response = await fetch(url.toString(), {
      method,
      headers: { ...headers, ...req.headers },
      body: body ? JSON.stringify(body) : null,
    });
    // Get response data
    const data = response.headers
      .get("Content-Type")
      ?.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    // Return the response with appropriate status code
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from API" },
      { status: 500 }
    );
  }
}
