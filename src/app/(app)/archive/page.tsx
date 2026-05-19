"use client";

import { useState, useMemo } from "react";
import { ArchiveRestoreIcon, SearchIcon, ArchiveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { EventCard, EventCardData } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { getArchivedEvents } from "@/lib/data/events";
import type { Event } from "@/types";

function toCardData(e: Event): EventCardData {
  return {
    id: e.id,
    title: e.title,
    datetime: { dateLabel: e.date, timeLabel: e.time },
    location: { label: e.location },
    status: e.status,
    stats: { tasksCount: e.task_count, rsvpsCount: e.rsvp_count },
  };
}

const ARCHIVED = getArchivedEvents().map(toCardData);

function RestoreDialog({ eventTitle }: { eventTitle: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <ArchiveRestoreIcon className="size-3.5" />
          Restore
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore event?</DialogTitle>
          <DialogDescription>
            &quot;{eventTitle}&quot; will be moved back to your active events
            list with a status of Upcoming.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>
            <ArchiveRestoreIcon /> Restore event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ArchivePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return ARCHIVED;
    const q = search.toLowerCase();
    return ARCHIVED.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.label.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div>
      <Header title="Archive" />
      <Separator className="my-4" />

      <div className="flex items-center gap-3 mb-6">
        <InputGroup className="max-w-xs">
          <InputGroupInput
            placeholder="Search archived events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <p className="text-sm text-muted-foreground">
          {ARCHIVED.length} archived events
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <ArchiveIcon className="size-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No archived events found</p>
          <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 opacity-80">
          {filtered.map((event) => (
            <div key={event.id} className="relative">
              <EventCard
                event={event}
                onClick={() => router.push(`/events/${event.id}`)}
              />
              <div className="absolute bottom-3 right-12">
                <RestoreDialog eventTitle={event.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
