import { notFound } from "next/navigation";

import { EventBreadcrumbs } from "@/components/events/event-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import {
  Calendar1Icon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
} from "lucide-react";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function EventLayout({ children, params }: Props) {
  const { id } = await params;

  if (!id) notFound();

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <EventBreadcrumbs eventId={id} eventName="Event Name" />
      </header>

      <Separator />

      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Event {id}</h1>
        <div className="mb-2 flex flex-row items-center gap-4">
          <div className="flex items-center">
            <Calendar1Icon className="inline size-4 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Fri 30 May 2026
            </span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="inline size-4 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              12:00 PM - 2:00 PM
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="inline size-4 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              School Hall
            </span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="inline size-4 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              ~150 attendees
            </span>
          </div>
          <div className="flex items-center">
            <TicketIcon className="inline size-4 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">89 RSVPs</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
