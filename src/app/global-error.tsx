"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";

export default function GlobalError({
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
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4 text-center px-4 max-w-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircleIcon className="size-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Something went wrong</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message?.replace(/\s*\(digest:.*?\)$/, "").trim() ||
                "An unexpected error occurred."}
            </p>
          </div>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
