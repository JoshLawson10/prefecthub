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
            <Select name="assign_member">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a member..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Team members</SelectLabel>
                  {TEAM_MEMBERS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="assign-role">Event role</FieldLabel>
            <Select name="assign_role">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="lead">Event lead</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
