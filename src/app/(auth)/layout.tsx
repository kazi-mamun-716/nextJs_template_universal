/**
 * Auth pages layout — centered card layout for login, register, etc.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {children}
      </div>
    </main>
  );
}
