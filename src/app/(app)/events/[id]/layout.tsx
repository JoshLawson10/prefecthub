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
import { getEvent } from "@/lib/data/events";
import { EVENT_STATUS_BADGE } from "@/components/events/event-card";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

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
  const event = getEvent(id);

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
            variant={EVENT_STATUS_BADGE[event.status]}
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
          {event.max_capacity && (
            <div className="flex items-center gap-1.5">
              <UsersIcon className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                ~{event.max_capacity} attendees
              </span>
            </div>
          )}
          {event.rsvp_count > 0 && (
            <div className="flex items-center gap-1.5">
              <TicketIcon className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {event.rsvp_count} RSVPs
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
