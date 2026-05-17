"use client";

import { UserPlusIcon } from "lucide-react";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const TEAM_MEMBERS = [
  { id: "1", name: "Josh Lawson", initials: "JL" },
  { id: "2", name: "Sophie Nguyen", initials: "SN" },
  { id: "3", name: "Alex Kim", initials: "AK" },
  { id: "4", name: "Mia Thompson", initials: "MT" },
  { id: "5", name: "Ryan Patel", initials: "RP" },
  { id: "6", name: "Emma Chen", initials: "EC" },
  { id: "7", name: "James Wu", initials: "JW" },
];

export function AssignMemberDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon /> Assign member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign member</DialogTitle>
          <DialogDescription>
            Add a prefect to this event&apos;s team.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="assign-member">Team member</FieldLabel>
            <select
              id="assign-member"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select a member...</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="assign-role">Event role</FieldLabel>
            <select
              id="assign-role"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="member">Member</option>
              <option value="lead">Event lead</option>
            </select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>
            <UserPlusIcon /> Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
