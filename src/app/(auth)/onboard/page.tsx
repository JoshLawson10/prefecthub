"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { completeOnboarding } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setSessionError("Auth session missing!");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [supabase.auth]);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name");
      setSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setSubmitting(false);
      return;
    }

    try {
      await completeOnboarding({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSubmitting(false);
    }
  }

  if (sessionError) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3">
            <p className="text-sm text-destructive">{sessionError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Create your account</h1>

          <p className="text-sm text-muted-foreground">
            Finish setting up your PrefectHub profile.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>

            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={submitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>

            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={submitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />

            <p className="mt-1 text-xs text-muted-foreground">
              At least 8 characters
            </p>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>

            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
            />
          </Field>

          <Field>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={
                submitting ||
                !firstName.trim() ||
                !lastName.trim() ||
                password.length < 8 ||
                password !== confirmPassword
              }
            >
              {submitting ? "Creating account..." : "Create account"}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
