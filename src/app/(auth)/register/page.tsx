import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your details to get started</p>
      </div>
      <RegisterForm />
    </>
  );
}
