"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, MonitorSmartphoneIcon } from "lucide-react";
import { getDeviceSessions } from "@/lib/data/settings";
import { changePassword } from "@/lib/actions/profile";

export default function SecurityPage() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessions = getDeviceSessions();

  async function handlePasswordSave() {
    setError(null);

    if (newPw !== confirmPw) {
      setError("New passwords don't match");
      return;
    }
    if (newPw.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword: currentPw, newPassword: newPw });
      setPwSaved(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setTimeout(() => setPwSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSaving(false);
    }
  }

  const canSave =
    !saving && currentPw.length > 0 && newPw.length >= 8 && newPw === confirmPw;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Choose a strong password of at least 8 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="sec-current-pw">Current password</FieldLabel>
              <Input
                id="sec-current-pw"
                type="password"
                placeholder="Enter current password"
                className="max-w-sm"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                disabled={saving}
              />
            </Field>
            <Separator />
            <Field>
              <FieldLabel htmlFor="sec-new-pw">New password</FieldLabel>
              <Input
                id="sec-new-pw"
                type="password"
                placeholder="At least 8 characters"
                className="max-w-sm"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                disabled={saving}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sec-confirm-pw">
                Confirm new password
              </FieldLabel>
              <Input
                id="sec-confirm-pw"
                type="password"
                placeholder="Re-enter new password"
                className="max-w-sm"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                disabled={saving}
              />
            </Field>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handlePasswordSave} disabled={!canSave}>
            {pwSaved ? (
              <>
                <CheckIcon /> Updated
              </>
            ) : saving ? (
              "Updating..."
            ) : (
              "Update password"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            These devices are currently signed in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {sessions.map((session, i) => (
            <div key={session.id}>
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MonitorSmartphoneIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{session.device}</p>
                      {session.current && (
                        <Badge variant="secondary" className="text-xs">
                          This device
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {session.location} á Last active {session.last_active}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="destructive" size="sm">
            Sign out all other sessions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
