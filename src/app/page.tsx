"use client";
import { Button } from "@/components/Button";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to VMail</h1>
      <p className="mt-4">Please sign in to access your dashboard.</p>
      <Button className="mt-6" onClick={() => signIn("google")}>
        Sign in with Google
      </Button>
    </div>
  );
}
