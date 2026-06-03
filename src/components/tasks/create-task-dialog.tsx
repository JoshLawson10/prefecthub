"use client";

import { useState } from "react";
import { PlusIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createTask } from "@/lib/actions/tasks";
import type { TaskPriority, User } from "@/lib/schemas";

interface CreateTaskDialogProps {
  eventId: string;
  workspaceMembers: User[];
  trigger?: React.ReactNode;
}

export function CreateTaskDialog({
  eventId,
  workspaceMembers,
  trigger,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    await createTask({
      eventId,
      title: data.get("title") as string,
      description: (data.get("description") as string) || null,
      assigneeId: assigneeId || null,
      priority: (priority as TaskPriority) || "medium",
      dueDate: dueDate ?? null,
    });
    setLoading(false);
    setDueDate(undefined);
    setAssigneeId("");
    setPriority("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <PlusIcon /> Add task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Add task</DialogTitle>
            <DialogDescription>
              Create a new task and assign it to a team member.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="task-title">Title</FieldLabel>
              <Input
                id="task-title"
                name="title"
                placeholder="What needs to be done?"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="task-desc">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Textarea id="task-desc" name="description" rows={2} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Assignee</FieldLabel>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Team members</SelectLabel>
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
                <FieldLabel>Priority</FieldLabel>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Due date</FieldLabel>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start font-normal",
                      !dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "d MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(d) => {
                      setDueDate(d);
                      setDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
