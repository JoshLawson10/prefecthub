"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EventCard, EventCardData } from "@/components/events/event-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PlusIcon, SearchIcon } from "lucide-react";

const FILTERS = ["All", "Upcoming", "In Progress", "Completed"] as const;

type Filter = (typeof FILTERS)[number];

const events: EventCardData[] = [
  {
    id: 1,
    title: "Prefect Afternoon Tea",
    datetime: {
      dateLabel: "Fri 30 May",
      timeLabel: "3:00 PM - 5:00 PM",
    },
    location: {
      label: "Hall B",
    },
    status: "upcoming",
    stats: {
      tasksCount: 12,
      rsvpsCount: 120,
    },
  },
  {
    id: 2,
    title: "Yr 12 Assembly",
    datetime: {
      dateLabel: "Mon 26 May",
      timeLabel: "10:00 AM - 11:00 AM",
    },
    location: {
      label: "Hall A",
    },
    status: "ongoing",
    stats: {
      tasksCount: 5,
      rsvpsCount: 200,
    },
  },
  {
    id: 3,
    title: "Yr 7 Orientation Day",
    datetime: {
      dateLabel: "Wed 18 Jun",
      timeLabel: "9:00 AM - 2:00 PM",
    },
    location: {
      label: "Quad",
    },
    status: "completed",
    stats: {
      tasksCount: 20,
      rsvpsCount: 300,
    },
  },
  {
    id: 4,
    title: "Farewell Ceremony",
    datetime: {
      dateLabel: "Fri 20 Jun",
      timeLabel: "2:00 PM - 4:00 PM",
    },
    location: {
      label: "Auditorium",
    },
    status: "cancelled",
    stats: {
      tasksCount: 0,
      rsvpsCount: 0,
    },
  },
];

export default function EventsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  return (
    <div>
      <Header
        title="Events"
        actions={
          <Button>
            <PlusIcon /> New event
          </Button>
        }
      />
      <Separator className="my-4" />

      <div className="mt-8 flex items-center gap-4">
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex items-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;

            return (
              <Button
                key={f}
                variant={active ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-4 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
