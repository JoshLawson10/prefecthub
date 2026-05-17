"use client";

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

const LOG_TYPES = [
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "phone", label: "Phone" },
  { value: "note", label: "Note" },
];

export function LogCorrespondenceDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> Log entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Log correspondence</DialogTitle>
            <DialogDescription>
              Record an email, meeting, phone call, or note related to this
              event.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="log-type">Type</FieldLabel>
              <Select name="log_type">
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
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="log-contact-name">Contact name</FieldLabel>
                <Input
                  id="log-contact-name"
                  name="contact_name"
                  placeholder="e.g. Ms Carter"
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
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
