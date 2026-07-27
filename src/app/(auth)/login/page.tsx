import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
      </div>
      <LoginForm />
    </>
  );
}
