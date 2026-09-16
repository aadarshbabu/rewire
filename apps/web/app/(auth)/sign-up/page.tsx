import { Metadata } from "next";
import { Suspense } from "react";
import { SignUpCard } from "@/components/auth/sign-up-card";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create an Account - Rewire",
  description: "Create a new account on Rewire",
};

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        </div>
      }
    >
      <SignUpCard />
    </Suspense>
  );
}
