"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SEGMENT_LABELS: Record<string, string> = {
  tasks: "Tasks",
  correspondence: "Correspondence",
  documents: "Documents",
  notes: "Notes",
  team: "Team",
  timeline: "Timeline",
};

interface EventBreadcrumbsProps {
  eventId: string;
  eventName: string;
}

export function EventBreadcrumbs({
  eventId,
  eventName,
}: EventBreadcrumbsProps) {
  const segment = useSelectedLayoutSegment();

  const currentLabel = segment ? (SEGMENT_LABELS[segment] ?? segment) : null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/events">Events</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="hidden md:block" />

        <BreadcrumbItem>
          <BreadcrumbLink href={`/events/${eventId}`}>
            {eventName}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {currentLabel && (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
