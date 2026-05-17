"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { EventCard, EventCardData, EventStatus } from "@/components/events/event-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewEventDialog } from "@/components/dashboard/new-event-dialog";

const FILTERS = ["All", "Upcoming", "Ongoing", "Completed", "Cancelled"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_STATUS_MAP: Record<Filter, EventStatus | null> = {
  All:       null,
  Upcoming:  "upcoming",
  Ongoing:   "ongoing",
  Completed: "completed",
  Cancelled: "cancelled",
};

const events: EventCardData[] = [
  {
    id: "1",
    title: "Prefect Afternoon Tea",
    datetime: { dateLabel: "Fri 30 May", timeLabel: "3:00 PM - 5:00 PM" },
    location: { label: "Hall B" },
    status: "upcoming",
    stats: { tasksCount: 12, rsvpsCount: 120 },
  },
  {
    id: "2",
    title: "Yr 12 Assembly",
    datetime: { dateLabel: "Mon 26 May", timeLabel: "10:00 AM - 11:00 AM" },
    location: { label: "Hall A" },
    status: "ongoing",
    stats: { tasksCount: 5, rsvpsCount: 200 },
  },
  {
    id: "3",
    title: "Yr 7 Orientation Day",
    datetime: { dateLabel: "Wed 18 Jun", timeLabel: "9:00 AM - 2:00 PM" },
    location: { label: "Quad" },
    status: "completed",
    stats: { tasksCount: 20, rsvpsCount: 300 },
  },
  {
    id: "4",
    title: "Farewell Ceremony",
    datetime: { dateLabel: "Fri 20 Jun", timeLabel: "2:00 PM - 4:00 PM" },
    location: { label: "Auditorium" },
    status: "cancelled",
    stats: { tasksCount: 0, rsvpsCount: 0 },
  },
];

export default function EventsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = events;

    const statusFilter = FILTER_STATUS_MAP[filter];
    if (statusFilter) {
      result = result.filter((e) => e.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.label.toLowerCase().includes(q),
      );
    }

    return result;
  }, [filter, search]);

  return (
    <div>
      <Header
        title="Events"
        actions={<NewEventDialog />}
      />
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
          <p className="text-sm text-muted-foreground">No events match your filters.</p>
          <Button variant="ghost" size="sm" onClick={() => { setFilter("All"); setSearch(""); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => router.push(`/events/${event.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
