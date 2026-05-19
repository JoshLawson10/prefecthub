"use client";

import { useRef, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, UploadIcon, Trash2Icon } from "lucide-react";
import { getMember } from "@/lib/data/members";

// TODO: replace with session user once auth is wired up
const CURRENT_USER = getMember("1")!;

const ACCEPTED = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("Please upload a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_BYTES) {
      setAvatarError("Image must be under 2 MB.");
      e.target.value = "";
      return;
    }

    // Revoke previous object URL to avoid memory leaks
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(URL.createObjectURL(file));
    e.target.value = "";
  }

  function handleRemove() {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(null);
    setAvatarError(null);
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
                  defaultValue={CURRENT_USER.full_name}
                  placeholder="Enter your full name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-email">Email address</FieldLabel>
                <Input
                  id="profile-email"
                  type="email"
                  defaultValue={CURRENT_USER.email}
                  placeholder="Enter your email"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="profile-role">Role</FieldLabel>
              <Input
                id="profile-role"
                type="text"
                defaultValue={CURRENT_USER.role === "admin" ? "Admin" : "Prefect"}
                disabled
                className="max-w-xs capitalize"
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
            <Avatar size="lg" className="size-16 text-xl">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={CURRENT_USER.full_name} />}
              <AvatarFallback>{CURRENT_USER.initials}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon className="size-3.5" />
                  {avatarUrl ? "Change photo" : "Upload photo"}
                </Button>
                {avatarUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive"
                    onClick={handleRemove}
                  >
                    <Trash2Icon className="size-3.5" />
                    Remove
                  </Button>
                )}
              </div>
              {avatarError ? (
                <p className="text-xs text-destructive">{avatarError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WebP · Max 2 MB
                </p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={handleFileChange}
            />
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
