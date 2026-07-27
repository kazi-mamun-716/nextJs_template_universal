export default function LoadingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />

        {/* Loading text */}
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-foreground">Loading...</p>
          <p className="text-xs text-muted-foreground">Please wait while we prepare your content</p>
        </div>

        {/* Skeleton bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary/50" />
        </div>
      </div>
    </main>
  );
}
