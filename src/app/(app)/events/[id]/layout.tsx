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

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const tabs = [
  {
    label: "Tasks",
    href: "tasks",
  },
  {
    label: "Correspondence",
    href: "correspondence",
  },
  {
    label: "Documents",
    href: "documents",
  },
  {
    label: "Notes",
    href: "notes",
  },
  {
    label: "Timeline",
    href: "timeline",
  },
  {
    label: "Team",
    href: "team",
  },
];

export default async function EventLayout({ children, params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <header className="mb-4">
        <EventBreadcrumbs eventId={id} eventName="Event Name" />
      </header>

      <Separator />

      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Event {id}</h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center">
              <Calendar1Icon className="text-muted-foreground size-4" />

              <span className="text-muted-foreground ml-2 text-sm">
                Fri 30 May 2026
              </span>
            </div>

            <div className="flex items-center">
              <ClockIcon className="text-muted-foreground size-4" />

              <span className="text-muted-foreground ml-2 text-sm">
                12:00 PM - 2:00 PM
              </span>
            </div>

            <div className="flex items-center">
              <MapPinIcon className="text-muted-foreground size-4" />

              <span className="text-muted-foreground ml-2 text-sm">
                School Hall
              </span>
            </div>

            <div className="flex items-center">
              <UsersIcon className="text-muted-foreground size-4" />

              <span className="text-muted-foreground ml-2 text-sm">
                ~150 attendees
              </span>
            </div>

            <div className="flex items-center">
              <TicketIcon className="text-muted-foreground size-4" />

              <span className="text-muted-foreground ml-2 text-sm">
                89 RSVPs
              </span>
            </div>
          </div>
        </div>
      </div>

      <EventTabs tabs={tabs} basePath={`/events/${id}`} className="px-4" />

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
