"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { logCorrespondence } from "@/lib/actions/correspondence";
import type { LogType } from "@/lib/schemas";

const LOG_TYPES: { value: LogType; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "phone", label: "Phone" },
  { value: "note", label: "Note" },
];

interface LogCorrespondenceDialogProps {
  eventId: string;
}

export function LogCorrespondenceDialog({
  eventId,
}: LogCorrespondenceDialogProps) {
  const [open, setOpen] = useState(false);
  const [logType, setLogType] = useState<LogType | "">("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!logType) return;
    const data = new FormData(e.currentTarget);
    setLoading(true);
    await logCorrespondence({
      eventId,
      type: logType,
      subject: data.get("subject") as string,
      body: data.get("body") as string,
      contactName: data.get("contact_name") as string,
      contactEmail: (data.get("contact_email") as string) || null,
    });
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> Log entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Log correspondence</DialogTitle>
            <DialogDescription>
              Record an email, meeting, phone call, or note related to this
              event.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select
                value={logType}
                onValueChange={(v) => setLogType(v as LogType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a log type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Log type</SelectLabel>
                    {LOG_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="log-subject">Subject</FieldLabel>
              <Input
                id="log-subject"
                name="subject"
                placeholder="Brief subject line"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="log-contact-name">Contact name</FieldLabel>
                <Input
                  id="log-contact-name"
                  name="contact_name"
                  placeholder="e.g. Ms Carter"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="log-contact-email">
                  Contact email{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id="log-contact-email"
                  name="contact_email"
                  type="email"
                  placeholder="email@school.edu.au"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="log-body">Notes</FieldLabel>
              <Textarea
                id="log-body"
                name="body"
                rows={4}
                placeholder="Summarise the correspondence..."
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!logType || loading}>
              {loading ? "Saving…" : "Save entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
