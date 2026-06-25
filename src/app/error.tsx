"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const message =
      error.message && !error.message.toLowerCase().includes("minified")
        ? error.message
        : "An unexpected error occurred";
    toast.error(message);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircleIcon className="size-6 text-destructive" />
        </div>
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          {error.message && !error.message.toLowerCase().includes("minified")
            ? error.message
            : "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground/60">
            {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
