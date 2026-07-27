import { NotFoundContent } from "@/features/errors";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <NotFoundContent />
    </main>
  );
}
