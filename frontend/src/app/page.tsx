"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <HiOutlineMail className="h-12 w-12 text-blue-600" />
            <span className="text-3xl font-bold ml-2 text-gray-900">
              VihaanMail
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-2xl font-semibold text-center text-gray-800">
              Welcome to VihaanMail
            </h1>
            <p className="mt-3 text-center text-gray-600">
              Fast, efficient, and secure email for professionals
            </p>

            <div className="mt-8 space-y-4">
              <Button
                className="w-full h-12 text-base gap-3 bg-white border hover:bg-gray-50 text-gray-800 shadow-sm cursor-pointer"
                variant="outline"
                onClick={() =>
                  signIn(
                    "google",
                    process.env.NEXT_PUBLIC_IS_LOCALHOST === "true"
                      ? {}
                      : {
                          redirectTo: `${
                            process.env.NEXT_PUBLIC_AUTH_URL ||
                            "https://vihaanmail.site"
                          }/api/auth/callback/google`,
                        }
                  )
                }
              >
                <FcGoogle className="w-5 h-5" />
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center">
        <div className="flex flex-col items-start justify-center h-full p-16 bg-black bg-opacity-30">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-4">
              Effortless Communication
            </h2>
            <p className="text-lg">
              VihaanMail provides a seamless experience for all your email needs
              with powerful features and a clean interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
