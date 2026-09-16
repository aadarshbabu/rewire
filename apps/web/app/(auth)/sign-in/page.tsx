import { Metadata } from "next";
import { Suspense } from "react";
import { SignInCard } from "@/components/auth/sign-in-card";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In - Rewire",
  description: "Sign in to your Rewire account with email and password",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <SignInCard />
    </Suspense>
  );
}
