"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, CalendarIcon, Clock2Icon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createEvent } from "@/lib/actions";

export function NewEventDialog() {
  const [open, setOpen] = useState(false);
  const [collectRsvps, setCollectRsvps] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState("10:30");
  const [endTime, setEndTime] = useState("12:30");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date) return;

    const data = new FormData(e.currentTarget);
    setLoading(true);
    await createEvent({
      title:        data.get("event-title") as string,
      description:  (data.get("event-description") as string) || null,
      date,
      startTime,
      endTime,
      location:     data.get("event-location") as string,
      collectRsvps,
      maxCapacity:  collectRsvps
        ? Number(data.get("max-rsvps")) || null
        : null,
    });
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> New event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New Event</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new event.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="event-title">Event title</FieldLabel>
              <Input id="event-title" name="event-title" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="event-description">
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Textarea id="event-description" name="event-description" />
            </Field>
            <Field>
              <FieldLabel>Date & Time</FieldLabel>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {date
                      ? `${format(date, "d MMM yyyy")} · ${startTime} - ${endTime}`
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0" align="start">
                  <Card size="sm" className="border-0 shadow-none">
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => setDate(d)}
                        className="p-0"
                      />
                    </CardContent>
                    <CardFooter className="border-t bg-card">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              id="time-from"
                              type="time"
                              step="1"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value.slice(0, 5))}
                              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                            <InputGroupAddon>
                              <Clock2Icon className="text-muted-foreground" />
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="time-to">End Time</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              id="time-to"
                              type="time"
                              step="1"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value.slice(0, 5))}
                              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                            <InputGroupAddon>
                              <Clock2Icon className="text-muted-foreground" />
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>
                      </FieldGroup>
                    </CardFooter>
                  </Card>
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel htmlFor="event-location">Location</FieldLabel>
              <Input id="event-location" name="event-location" required />
            </Field>
            <Field>
              <div className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  id="collect-rsvps"
                  checked={collectRsvps}
                  onCheckedChange={(checked) => setCollectRsvps(!!checked)}
                />
                <FieldLabel htmlFor="collect-rsvps" className="mb-0">
                  Collect RSVPs
                </FieldLabel>
              </div>
            </Field>
            {collectRsvps && (
              <Field>
                <FieldLabel htmlFor="max-rsvps">Max RSVPs</FieldLabel>
                <Input
                  id="max-rsvps"
                  name="max-rsvps"
                  type="number"
                  min="1"
                  placeholder="Enter maximum number of RSVPs"
                />
              </Field>
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!date || loading}>
              {loading ? "Creating…" : "Create event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
