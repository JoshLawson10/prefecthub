"use client";

import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/actions/auth";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      action={requestPasswordReset}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive">{decodeURIComponent(error)}</p>
          </div>
        )}

        {success ? (
          <div className="rounded-md bg-green-500/10 border border-green-500/20 px-4 py-3">
            <p className="text-sm text-green-600 dark:text-green-400">
              If that email is registered, you will receive a reset link shortly.
              Check your inbox and spam folder.
            </p>
          </div>
        ) : (
          <>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="bg-background"
              />
            </Field>

            <Field>
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </Field>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <a href="/login" className="underline underline-offset-4 hover:text-foreground">
            Back to sign in
          </a>
        </p>
      </FieldGroup>
    </form>
  );
}
