"use client";

import { GlobalErrorContent } from "@/features/errors";

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
        <GlobalErrorContent error={error} reset={reset} />
      </body>
    </html>
  );
}
