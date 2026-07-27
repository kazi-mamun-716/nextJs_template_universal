import { ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
