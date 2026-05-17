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
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile information</CardTitle>
          <CardDescription>Update your name and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="profile-fullname">Full name</FieldLabel>
                <Input
                  id="profile-fullname"
                  type="text"
                  defaultValue="Josh Lawson"
                  placeholder="Enter your full name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-email">Email address</FieldLabel>
                <Input
                  id="profile-email"
                  type="email"
                  defaultValue="joshua.lawson13@education.nsw.gov.au"
                  placeholder="Enter your email"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="profile-role">Role</FieldLabel>
              <Input
                id="profile-role"
                type="text"
                defaultValue="Head Prefect"
                disabled
                className="max-w-xs"
              />
              <FieldDescription>
                Your role is managed by an admin and cannot be changed here.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline">Discard</Button>
          <Button onClick={handleSave}>
            {saved ? (
              <>
                <CheckIcon /> Saved
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile picture</CardTitle>
          <CardDescription>
            Upload a photo to personalise your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary select-none shrink-0">
              JL
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Upload photo
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or WebP. Max 2 MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="destructive" size="sm">
            Delete account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
