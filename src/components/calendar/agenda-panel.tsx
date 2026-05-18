import { format } from "date-fns";
import type { CalendarItem } from "@/types";
import { MapPinIcon, CheckSquareIcon, CalendarDaysIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function AgendaPanel({
  day,
  items,
}: {
  day: Date;
  items: CalendarItem[];
}) {
  const events = items.filter((i) => i.type === "event");
  const tasks = items.filter((i) => i.type === "task-due");

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold">{format(day, "EEEE")}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {format(day, "d MMMM yyyy")}
        </p>
      </div>

      <Separator />

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-6 gap-2 text-center">
          <CalendarDaysIcon className="size-7 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">Nothing scheduled</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Events
              </p>
              {events.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg p-2.5 flex flex-col gap-0.5 cursor-pointer transition-opacity hover:opacity-80",
                    item.color_class,
                  )}
                >
                  <p className={cn("text-xs font-semibold", item.text_class)}>
                    {item.title}
                  </p>
                  {item.location && (
                    <p
                      className={cn(
                        "text-[11px] flex items-center gap-1 opacity-75",
                        item.text_class,
                      )}
                    >
                      <MapPinIcon className="size-2.5" />
                      {item.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Tasks Due
              </p>
              {tasks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <CheckSquareIcon className="size-3 text-muted-foreground shrink-0" />
                  <span className="text-xs leading-tight">{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
