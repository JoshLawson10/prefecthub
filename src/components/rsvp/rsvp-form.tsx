"use client";

import { useState } from "react";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { useServerAction } from "@/hooks/use-server-action";
import { submitRsvp } from "@/lib/actions/rsvp";

interface RSVPFormProps {
  eventId: string;
  currentCount: number;
  maxCapacity: number | null;
}

export function RSVPForm({
  eventId,
  currentCount,
  maxCapacity,
}: RSVPFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFull = maxCapacity !== null && currentCount >= maxCapacity;
  const spotsLeft = maxCapacity !== null ? maxCapacity - currentCount : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    await submitRsvp({
      eventId,
      name: data.get("name") as string,
      email: data.get("email") as string,
      guestCount: Number(data.get("guest_count")) || 1,
      dietaryNotes: (data.get("dietary_notes") as string) || null,
    });
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircleIcon className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-lg font-semibold">You&apos;re on the list!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll send a confirmation to your email address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="rsvp-name">Full name</FieldLabel>
          <Input
            id="rsvp-name"
            name="name"
            placeholder="Your full name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="rsvp-email">Email address</FieldLabel>
          <Input
            id="rsvp-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <FieldDescription>
            We&apos;ll send your confirmation here.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="rsvp-guests">Number of guests</FieldLabel>
          <select
            id="rsvp-guests"
            name="guest_count"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="1">1 — Just me</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </Field>
        <Field>
          <FieldLabel htmlFor="rsvp-dietary">
            Dietary requirements{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </FieldLabel>
          <Textarea
            id="rsvp-dietary"
            name="dietary_notes"
            rows={2}
            placeholder="e.g. vegetarian, nut allergy..."
          />
        </Field>
      </FieldGroup>

      {spotsLeft !== null && spotsLeft <= 10 && (
        <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
          Only {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isFull || loading}>
        {isFull ? "Event is full" : loading ? "Submitting…" : "Confirm RSVP"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Your details are only shared with the prefect team.
      </p>
    </form>
  );
}
