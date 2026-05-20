"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
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
          <h1 className="text-2xl font-bold">Create your password</h1>

          <p className="text-sm text-muted-foreground">
            Finish setting up your account.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || password.length < 8}
            >
              {loading ? "Saving..." : "Create account"}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
