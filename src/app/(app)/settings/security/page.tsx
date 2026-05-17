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
import {
  CheckIcon,
  ShieldCheckIcon,
  MonitorSmartphoneIcon,
} from "lucide-react";

const SESSIONS = [
  {
    id: "s1",
    device: "MacBook Pro — Chrome",
    location: "Sydney, NSW",
    lastActive: "Now",
    current: true,
  },
  {
    id: "s2",
    device: "iPhone 15 — Safari",
    location: "Sydney, NSW",
    lastActive: "2 hours ago",
    current: false,
  },
];

export default function SecurityPage() {
  const [pwSaved, setPwSaved] = useState(false);

  function handlePasswordSave() {
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2000);
  }

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
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handlePasswordSave}>
            {pwSaved ? (
              <>
                <CheckIcon /> Updated
              </>
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
          {SESSIONS.map((session, i) => (
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
                      {session.location} · Last active {session.lastActive}
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
