"use client";

import { useState, useMemo } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  parseISO,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DayCell } from "./day-cell";
import { AgendaPanel } from "./agenda-panel";

export type CalendarItemType = "event" | "task-due";

export interface CalendarItem {
  id: string;
  type: CalendarItemType;
  title: string;
  date: string; // yyyy-MM-dd
  location?: string;
  colorClass: string; // bg utility class
  textClass: string; // text utility class
}

const ITEMS: CalendarItem[] = [
  {
    id: "e1",
    type: "event",
    title: "Prefect Afternoon Tea",
    date: "2026-05-30",
    location: "Hall B",
    colorClass: "bg-blue-500/10 dark:bg-blue-500/20",
    textClass: "text-blue-700 dark:text-blue-400",
  },
  {
    id: "e2",
    type: "event",
    title: "Yr 12 Assembly",
    date: "2026-05-26",
    location: "Hall A",
    colorClass: "bg-amber-500/10 dark:bg-amber-500/20",
    textClass: "text-amber-700 dark:text-amber-400",
  },
  {
    id: "e3",
    type: "event",
    title: "Yr 7 Orientation Day",
    date: "2026-06-18",
    location: "Quad",
    colorClass: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textClass: "text-emerald-700 dark:text-emerald-400",
  },
  {
    id: "e4",
    type: "event",
    title: "Farewell Ceremony",
    date: "2026-06-20",
    location: "Auditorium",
    colorClass: "bg-rose-500/10 dark:bg-rose-500/20",
    textClass: "text-rose-700 dark:text-rose-400",
  },
  {
    id: "t1",
    type: "task-due",
    title: "Book catering for PAT",
    date: "2026-05-20",
    colorClass: "bg-destructive/10",
    textClass: "text-destructive",
  },
  {
    id: "t2",
    type: "task-due",
    title: "Design RSVP form",
    date: "2026-05-22",
    colorClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
  {
    id: "t3",
    type: "task-due",
    title: "Post Instagram reminder",
    date: "2026-05-26",
    colorClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
  {
    id: "t4",
    type: "task-due",
    title: "Prepare assembly run sheet",
    date: "2026-05-24",
    colorClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView() {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedDay, setSelectedDay] = useState<Date>(today);

  const gridDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const itemsByDate = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    for (const item of ITEMS) {
      (map[item.date] ??= []).push(item);
    }
    return map;
  }, []);

  const selectedKey = format(selectedDay, "yyyy-MM-dd");
  const selectedItems = itemsByDate[selectedKey] ?? [];

  const upcomingEvents = useMemo(
    () =>
      ITEMS.filter((i) => i.type === "event").sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    [],
  );

  return (
    <div className="flex gap-6 h-full min-h-0">
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            >
              <ChevronLeftIcon />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentMonth(startOfMonth(today));
                setSelectedDay(today);
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            >
              <ChevronRightIcon />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1 border-l border-border overflow-hidden rounded-b-xl ring-1 ring-border/60">
          {gridDays.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            return (
              <DayCell
                key={key}
                day={day}
                items={itemsByDate[key] ?? []}
                isCurrentMonth={isSameMonth(day, currentMonth)}
                isSelected={isSameDay(day, selectedDay)}
                onSelect={setSelectedDay}
              />
            );
          })}
        </div>
      </div>

      <div className="w-56 shrink-0 flex flex-col gap-4">
        <Card>
          <CardContent className="pt-4">
            <AgendaPanel day={selectedDay} items={selectedItems} />
          </CardContent>
        </Card>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-0.5">
            All Events
          </p>
          <div className="flex flex-col gap-0.5">
            {upcomingEvents.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  const d = parseISO(item.date);
                  setCurrentMonth(startOfMonth(d));
                  setSelectedDay(d);
                }}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 w-full text-left hover:bg-muted/50 transition-colors group"
              >
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0 ring-1 ring-inset ring-current/20",
                    item.textClass,
                  )}
                  style={{ background: "currentColor" }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate group-hover:text-foreground transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {format(parseISO(item.date), "d MMM")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
