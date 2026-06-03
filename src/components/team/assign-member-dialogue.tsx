"use client";

import { useState } from "react";
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
import { assignTeamMember } from "@/lib/actions/team";
import type { EventRole, User } from "@/lib/schemas";

interface AssignMemberDialogProps {
  eventId: string;
  workspaceMembers: User[];
}

export function AssignMemberDialog({
  eventId,
  workspaceMembers,
}: AssignMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [role, setRole] = useState<EventRole | "">("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!memberId || !role) return;
    setLoading(true);
    await assignTeamMember({ eventId, memberId, role: role as EventRole });
    setLoading(false);
    setMemberId("");
    setRole("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <FieldLabel>Team member</FieldLabel>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a member..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Workspace members</SelectLabel>
                  {workspaceMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.full_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Event role</FieldLabel>
            <Select value={role} onValueChange={(v) => setRole(v as EventRole)}>
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
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!memberId || !role || loading}
          >
            <UserPlusIcon /> {loading ? "Assigning…" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
