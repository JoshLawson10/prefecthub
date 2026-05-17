import { notFound } from "next/navigation";
import {
  Calendar1Icon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import { EventBreadcrumbs } from "@/components/events/event-breadcrumbs";
import { EventTabs } from "@/components/events/event-tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const MOCK_EVENTS: Record<
  string,
  {
    title: string;
    date: string;
    time: string;
    location: string;
    capacity: string;
    rsvps: number;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
  }
> = {
  "1": {
    title: "Prefect Afternoon Tea",
    date: "Fri 30 May 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Hall B",
    capacity: "~150 attendees",
    rsvps: 89,
    status: "upcoming",
  },
  "2": {
    title: "Yr 12 Assembly",
    date: "Mon 26 May 2026",
    time: "10:00 AM - 11:00 AM",
    location: "Hall A",
    capacity: "~200 attendees",
    rsvps: 0,
    status: "upcoming",
  },
  "3": {
    title: "Yr 7 Orientation Day",
    date: "Wed 18 Jun 2026",
    time: "9:00 AM - 2:00 PM",
    location: "Quad",
    capacity: "~300 attendees",
    rsvps: 0,
    status: "upcoming",
  },
  "4": {
    title: "Farewell Ceremony",
    date: "Fri 20 Jun 2026",
    time: "2:00 PM - 4:00 PM",
    location: "Auditorium",
    capacity: "~250 attendees",
    rsvps: 0,
    status: "upcoming",
  },
};

const STATUS_BADGE: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  upcoming: "secondary",
  ongoing: "default",
  completed: "outline",
  cancelled: "destructive",
};

const tabs = [
  { label: "Tasks", href: "tasks" },
  { label: "Correspondence", href: "correspondence" },
  { label: "Documents", href: "documents" },
  { label: "Notes", href: "notes" },
  { label: "Timeline", href: "timeline" },
  { label: "Team", href: "team" },
];

export default async function EventLayout({ children, params }: Props) {
  const { id } = await params;
  const event = MOCK_EVENTS[id];

  if (!event) notFound();

  return (
    <div className="flex h-full flex-col">
      <header className="mb-4">
        <EventBreadcrumbs eventId={id} eventName={event.title} />
      </header>

      <Separator />

      <div className="flex flex-col gap-3 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
          <Badge
            variant={STATUS_BADGE[event.status]}
            className="mt-1 shrink-0 capitalize"
          >
            {event.status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1.5">
            <Calendar1Icon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {event.location}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {event.capacity}
            </span>
          </div>
          {event.rsvps > 0 && (
            <div className="flex items-center gap-1.5">
              <TicketIcon className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {event.rsvps} RSVPs
              </span>
            </div>
          )}
        </div>
      </div>

      <EventTabs tabs={tabs} basePath={`/events/${id}`} className="px-4" />

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
