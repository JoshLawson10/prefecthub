import { notFound } from "next/navigation";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { RSVPForm } from "@/components/rsvp/rsvp-form";
import { Separator } from "@/components/ui/separator";
import { getEventBySlug } from "@/lib/data/events";
import { getRsvpStats } from "@/lib/data/rsvp";
import { getCurrentWorkspace } from "@/lib/data/workspaces";
import { formatEventDate, formatEventTime } from "@/lib/utils/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RSVPPage({ params }: Props) {
  const { slug } = await params;

  const [event, workspace] = await Promise.all([
    getEventBySlug(slug),
    getCurrentWorkspace(),
  ]);

  if (!event) notFound();

  const rsvpStats = await getRsvpStats(event.id);
  const maxCapacity = event.max_capacity ?? 0;
  const fillPct =
    maxCapacity > 0 ? Math.round((rsvpStats.total / maxCapacity) * 100) : 0;
  const spotsLeft = maxCapacity > 0 ? maxCapacity - rsvpStats.total : null;

  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      {/* Left — event details */}
      <div className="flex flex-col justify-center bg-sidebar text-sidebar-foreground px-10 py-16 lg:px-16">
        <div className="max-w-md space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4">
              {workspace?.school ?? "Prefect Hub"}
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
              {formatEventDate(event)}
            </div>
            <div className="flex items-center gap-3 text-sm opacity-75">
              <ClockIcon className="size-4 shrink-0" />
              {formatEventTime(event)}
            </div>
            <div className="flex items-center gap-3 text-sm opacity-75">
              <MapPinIcon className="size-4 shrink-0" />
              {event.location}
            </div>
          </div>

          {maxCapacity > 0 && spotsLeft !== null && (
            <>
              <Separator className="opacity-10" />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs opacity-60">
                  <span>
                    {rsvpStats.total} of {maxCapacity} spots taken
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

      {/* Right — RSVP form */}
      <div className="flex flex-col justify-center bg-background px-8 py-16 lg:px-16">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">RSVP</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {maxCapacity > 0 && spotsLeft !== null
                ? `Reserve your spot — ${spotsLeft} remaining.`
                : "Reserve your spot for this event."}
            </p>
          </div>
          <RSVPForm
            eventId={event.id}
            currentCount={rsvpStats.total}
            maxCapacity={maxCapacity}
          />
        </div>
      </div>
    </div>
  );
}
