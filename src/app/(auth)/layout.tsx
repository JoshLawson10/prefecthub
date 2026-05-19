import { TerminalIcon } from "lucide-react";
import { getWorkspace } from "@/lib/data/workspace";
import { getMembers } from "@/lib/data/members";
import { getEvents } from "@/lib/data/events";

const workspace = getWorkspace();
const memberCount = getMembers().length;
const upcomingEvents = getEvents().filter((e) => e.status === "upcoming");
const totalRsvps = upcomingEvents.reduce((sum, e) => sum + e.rsvp_count, 0);

const STATS = [
  { value: String(memberCount), label: "Team members" },
  { value: String(upcomingEvents.length), label: "Upcoming events" },
  { value: String(totalRsvps), label: "RSVPs received" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TerminalIcon className="size-4" />
            </div>
            Prefect Hub
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>

      <div className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative flex items-center gap-2 text-sm font-medium opacity-60">
          <TerminalIcon className="size-4" />
          {workspace.school} · {workspace.year}
        </div>

        <div className="relative space-y-4">
          <p className="text-3xl font-semibold leading-snug tracking-tight">
            One place for the whole prefect body.
          </p>
          <p className="text-sm leading-relaxed opacity-60">
            Events, tasks, correspondence, documents and notes — all in one
            secure platform built for the {workspace.name} team.
          </p>

          <div className="flex gap-8 pt-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
                <p className="mt-0.5 text-xs opacity-50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs opacity-40">
          Built by Prefects, for Prefects. © {workspace.year} {workspace.school}
          . All rights reserved.
        </p>
      </div>
    </div>
  );
}
