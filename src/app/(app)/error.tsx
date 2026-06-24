"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const msg = error.message?.replace(/\s*\(digest:.*?\)$/, "").trim();
    if (msg) toast.error(msg);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4 py-24">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircleIcon className="size-6 text-destructive" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-xs">
          {error.message?.replace(/\s*\(digest:.*?\)$/, "").trim() ||
            "An unexpected error occurred. Please try again."}
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
