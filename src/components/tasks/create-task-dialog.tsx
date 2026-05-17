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

const MEMBERS = [
  { id: "1", name: "Josh Lawson" },
  { id: "2", name: "Sophie Nguyen" },
  { id: "3", name: "Alex Kim" },
  { id: "4", name: "Mia Thompson" },
  { id: "5", name: "Ryan Patel" },
  { id: "6", name: "Emma Chen" },
  { id: "7", name: "James Wu" },
];

interface CreateTaskDialogProps {
  trigger?: React.ReactNode;
}

export function CreateTaskDialog({ trigger }: CreateTaskDialogProps) {
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <PlusIcon /> Add task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form className="flex flex-col gap-4">
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
                <FieldLabel htmlFor="task-assignee">Assignee</FieldLabel>
                <select
                  id="task-assignee"
                  name="assignee"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Unassigned</option>
                  {MEMBERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
                <select
                  id="task-priority"
                  name="priority"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Due date</FieldLabel>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
