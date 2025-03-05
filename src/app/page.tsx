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
            <span className="text-3xl font-bold ml-2 text-gray-900">VMail</span>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-2xl font-semibold text-center text-gray-800">
              Welcome to VMail
            </h1>
            <p className="mt-3 text-center text-gray-600">
              Fast, efficient, and secure email for professionals
            </p>

            <div className="mt-8 space-y-4">
              <Button
                className="w-full h-12 text-base gap-3 bg-white border hover:bg-gray-50 text-gray-800 shadow-sm"
                variant="outline"
                onClick={() => signIn("google")}
              >
                <FcGoogle className="w-5 h-5" />
                Sign in with Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base"
                onClick={() => signIn("google")}
              >
                Continue with Email
              </Button>
            </div>

            <p className="mt-8 text-xs text-center text-gray-500">
              By signing in, you agree to our
              <a href="#" className="text-blue-600 hover:underline">
                {" "}
                Terms of Service{" "}
              </a>
              and
              <a href="#" className="text-blue-600 hover:underline">
                {" "}
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="flex flex-col items-start justify-center h-full p-16 bg-black bg-opacity-30">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-4">
              Effortless Communication
            </h2>
            <p className="text-lg">
              VMail provides a seamless experience for all your email needs with
              powerful features and a clean interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
