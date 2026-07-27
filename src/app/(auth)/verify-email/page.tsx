import { VerifyEmailForm } from "@/features/auth";
import { Suspense } from "react";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Confirm your email address to activate your account.
        </p>
      </div>
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </>
  );
}
