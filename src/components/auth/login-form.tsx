"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams    = useSearchParams();
  const error           = searchParams.get("error");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError,   setGoogleError]   = useState<string | null>(null);

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setGoogleError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setGoogleError(error.message);
      setGoogleLoading(false);
    }
    // On success, Supabase redirects the browser to Google — no further
    // client code runs until the callback returns.
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      action={login}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Sign in to Prefect Hub
          </p>
        </div>

        {(error || googleError) && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive">
              {googleError ?? decodeURIComponent(error!)}
            </p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@cumberland.edu.au"
            required
            autoComplete="email"
            className="bg-background"
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="bg-background"
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </Field>

        <FieldSeparator>or</FieldSeparator>

        <Field>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={googleLoading}
            onClick={handleGoogleLogin}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Request Access
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
