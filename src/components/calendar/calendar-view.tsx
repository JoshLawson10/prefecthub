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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DayCell } from "./day-cell";
import { AgendaPanel } from "./agenda-panel";
import { getCalendarItems } from "@/lib/data/calendar";
import type { CalendarItem } from "@/types";

export type { CalendarItem };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView() {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1));
  const [selectedDay, setSelectedDay] = useState<Date>(today);

  const items = useMemo(() => getCalendarItems(), []);

  const gridDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const itemsByDate = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    for (const item of items) {
      (map[item.date] ??= []).push(item);
    }
    return map;
  }, [items]);

  const selectedKey = format(selectedDay, "yyyy-MM-dd");
  const selectedItems = itemsByDate[selectedKey] ?? [];

  const upcomingEvents = useMemo(
    () =>
      items
        .filter((i) => i.type === "event")
        .sort((a, b) => a.date.localeCompare(b.date)),
    [items],
  );

  return (
    <div className="flex gap-6 h-full min-h-0">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Month navigation */}
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

        {/* Weekday headers */}
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

        {/* Day grid */}
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

      {/* Sidebar */}
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
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.colour ?? "#888" }}
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
