"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { EventCard, type EventCardData } from "@/components/events/event-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewEventDialog } from "@/components/dashboard/new-event-dialog";
import { formatEventDate, formatEventTime } from "@/lib/utils/format";
import type { Event } from "@/lib/schemas";

const FILTERS = [
  "All",
  "Upcoming",
  "Ongoing",
  "Completed",
  "Cancelled",
] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_STATUS_MAP: Record<Filter, string | null> = {
  All: null,
  Upcoming: "upcoming",
  Ongoing: "ongoing",
  Completed: "completed",
  Cancelled: "cancelled",
};

function toCardData(e: Event): EventCardData {
  return {
    id: e.id,
    title: e.title,
    datetime: { dateLabel: formatEventDate(e), timeLabel: formatEventTime(e) },
    location: { label: e.location },
    status: e.status,
  };
}

interface EventsClientProps {
  events: Event[];
}

export function EventsClient({ events }: EventsClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = events;
    const statusFilter = FILTER_STATUS_MAP[filter];
    if (statusFilter) result = result.filter((e) => e.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      );
    }
    return result;
  }, [events, filter, search]);

  return (
    <div>
      <Header title="Events" actions={<NewEventDialog />} />
      <Separator className="my-4" />

      <div className="flex items-center gap-3 flex-wrap">
        <InputGroup className="max-w-xs">
          <InputGroupInput
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            No events match your filters.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilter("All");
              setSearch("");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={toCardData(event)}
              onClick={() => router.push(`/events/${event.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
