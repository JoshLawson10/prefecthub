"use client";

import { useState, useTransition, useCallback } from "react";
import { toast } from "sonner";

interface Options<T> {
  /** Toast message on success. Omit to show no success toast. */
  successMessage?: string | ((result: T) => string);
  /** Override the error toast message. Defaults to the thrown error message. */
  errorMessage?: string;
  /** Called after a successful action (e.g. close a dialog). */
  onSuccess?: (result: T) => void;
}

/**
 * Wraps a server action so that:
 *  - Errors are caught and shown as a Sonner error toast instead of crashing
 *  - An optional success toast is shown on completion
 *  - Loading state is tracked via useTransition
 *
 * Usage:
 *   const { execute, isPending } = useServerAction(createEvent, {
 *     successMessage: "Event created",
 *     onSuccess: () => setOpen(false),
 *   });
 *
 *   <Button disabled={isPending} onClick={() => execute(input)}>Save</Button>
 */
export function useServerAction<TArgs extends unknown[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>,
  options: Options<TReturn> = {},
) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    (...args: TArgs) => {
      setError(null);

      startTransition(async () => {
        try {
          const result = await action(...args);

          if (options.successMessage) {
            const msg =
              typeof options.successMessage === "function"
                ? options.successMessage(result)
                : options.successMessage;
            toast.success(msg);
          }

          options.onSuccess?.(result);
        } catch (err) {
          const msg =
            options.errorMessage ??
            (err instanceof Error ? err.message : "Something went wrong.");

          // Strip Next.js digest suffix that sometimes appears on server errors
          const clean = msg.replace(/\s*\(digest:.*?\)$/, "").trim();

          setError(clean);
          toast.error(clean);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [action, options.successMessage, options.errorMessage, options.onSuccess],
  );

  return { execute, isPending, error };
}
