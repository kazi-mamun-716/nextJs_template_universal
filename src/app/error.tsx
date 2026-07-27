"use client";

import { ErrorContent } from "@/features/errors";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <ErrorContent error={error} reset={reset} />
    </main>
  );
}
