import { notFound } from "next/navigation";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { RSVPForm } from "@/components/rsvp/rsvp-form";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ slug: string }>;
}

const RSVP_EVENTS: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    organisation: string;
    maxCapacity: number;
    currentCount: number;
  }
> = {
  "pat-2026": {
    id: "1",
    title: "Prefect Afternoon Tea",
    description:
      "Join us for an afternoon celebrating the 2026 Yr 12 cohort. Food, music, and activities — all Year 12 students welcome.",
    date: "Friday, 30 May 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Hall B, Cumberland High School",
    organisation: "Cumberland High School Prefects",
    maxCapacity: 150,
    currentCount: 89,
  },
};

export default async function RSVPPage({ params }: Props) {
  const { slug } = await params;
  const event = RSVP_EVENTS[slug];

  if (!event) notFound();

  const fillPct = Math.round((event.currentCount / event.maxCapacity) * 100);
  const spotsLeft = event.maxCapacity - event.currentCount;

  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-sidebar text-sidebar-foreground px-10 py-16 lg:px-16">
        <div className="max-w-md space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4">
              {event.organisation}
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              {event.title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed opacity-60">
              {event.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm opacity-75">
              <CalendarIcon className="size-4 shrink-0" />
              {event.date}
            </div>
            <div className="flex items-center gap-3 text-sm opacity-75">
              <ClockIcon className="size-4 shrink-0" />
              {event.time}
            </div>
            <div className="flex items-center gap-3 text-sm opacity-75">
              <MapPinIcon className="size-4 shrink-0" />
              {event.location}
            </div>
          </div>

          <Separator className="opacity-10" />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs opacity-60">
              <span>
                {event.currentCount} of {event.maxCapacity} spots taken
              </span>
              <span>{spotsLeft} remaining</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/50 transition-all"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-background px-8 py-16 lg:px-16">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">RSVP</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Reserve your spot — {spotsLeft} remaining.
            </p>
          </div>
          <RSVPForm
            eventId={event.id}
            currentCount={event.currentCount}
            maxCapacity={event.maxCapacity}
          />
        </div>
      </div>
    </div>
  );
}
