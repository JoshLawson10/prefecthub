"use client";

import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/actions/auth";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      action={resetPassword}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Choose a strong password of at least 8 characters.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive">{decodeURIComponent(error)}</p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            required
            autoComplete="new-password"
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm">Confirm new password</FieldLabel>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="Re-enter your new password"
            required
            autoComplete="new-password"
            className="bg-background"
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full">
            Update password
          </Button>
        </Field>

        <p className="text-center text-sm text-muted-foreground">
          <a href="/login" className="underline underline-offset-4 hover:text-foreground">
            Back to sign in
          </a>
        </p>
      </FieldGroup>
    </form>
  );
}
