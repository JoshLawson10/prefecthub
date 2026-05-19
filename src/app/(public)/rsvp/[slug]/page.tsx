import { notFound } from "next/navigation";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { RSVPForm } from "@/components/rsvp/rsvp-form";
import { Separator } from "@/components/ui/separator";
import { getEventBySlug } from "@/lib/data/events";
import { getWorkspace } from "@/lib/data/workspace";

export default async function RSVPPage(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) notFound();

  const workspace = getWorkspace();
  const maxCapacity = event.max_capacity ?? 0;
  const fillPct =
    maxCapacity > 0 ? Math.round((event.rsvp_count / maxCapacity) * 100) : 0;
  const spotsLeft = maxCapacity - event.rsvp_count;

  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-sidebar text-sidebar-foreground px-10 py-16 lg:px-16">
        <div className="max-w-md space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4">
              {workspace.school} Prefects
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              {event.title}
            </h1>
            {event.description && (
              <p className="mt-4 text-sm leading-relaxed opacity-60">
                {event.description}
              </p>
            )}
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

          {maxCapacity > 0 && (
            <>
              <Separator className="opacity-10" />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs opacity-60">
                  <span>
                    {event.rsvp_count} of {maxCapacity} spots taken
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
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center bg-background px-8 py-16 lg:px-16">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">RSVP</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {maxCapacity > 0
                ? `Reserve your spot — ${spotsLeft} remaining.`
                : "Reserve your spot for this event."}
            </p>
          </div>
          <RSVPForm
            eventId={event.id}
            currentCount={event.rsvp_count}
            maxCapacity={maxCapacity}
          />
        </div>
      </div>
    </div>
  );
}
