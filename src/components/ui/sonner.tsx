"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group border border-border bg-background text-foreground shadow-lg rounded-lg",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          error: "border-destructive/40 bg-destructive/10 text-destructive",
          success: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
        },
      }}
    />
  );
}
