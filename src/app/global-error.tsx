"use client";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-2 text-6xl font-bold text-destructive">500</h1>
            <h2 className="mb-4 text-2xl font-semibold">Critical Error</h2>
            <p className="mb-8 text-muted-foreground">
              A critical error occurred. Please refresh the page or try again later.
            </p>
            <button
              onClick={reset}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
