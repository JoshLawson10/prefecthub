"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { completeOnboarding } from "@/lib/actions/profile";
import { verifyInvitationToken } from "@/lib/actions/invitations";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface Invitation {
  email: string;
  workspace?: {
    name: string;
  };
}

export default function OnboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);

  // Verify invitation token on load
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setError(
          "No invitation token found. Please ask an admin for a new invitation.",
        );
        setLoading(false);
        return;
      }

      try {
        const result = await verifyInvitationToken(token);

        if (!result.valid) {
          setError(result.error || "Invalid or expired invitation");
          setLoading(false);
          return;
        }

        setInvitation(result.invitation);
        setLoading(false);
      } catch (err) {
        setError("Failed to verify invitation. Please try again.");
        setLoading(false);
      }
    }

    verifyToken();
  }, [token]);

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
        token: token!,
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

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p>Verifying your invitation...</p>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
          <Button onClick={() => router.push("/login")} className="w-full">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Complete your account</h1>

          <p className="text-sm text-muted-foreground">
            You&apos;ve been invited to join{" "}
            {invitation?.workspace?.name || "a workspace"}. Fill in your details
            to get started.
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
            <FieldLabel htmlFor="email">Email</FieldLabel>

            <Input
              id="email"
              type="email"
              disabled
              value={invitation?.email || ""}
              className="bg-muted"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              This email was used to invite you
            </p>
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
              {submitting ? "Creating account..." : "Complete sign up"}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
