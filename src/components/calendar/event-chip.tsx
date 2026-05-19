import type { CalendarItem } from "@/types";
import { cn } from "@/lib/utils";
import { CheckSquareIcon } from "lucide-react";

export function EventChip({ item }: { item: CalendarItem }) {
  const isEvent = item.type === "event" && item.colour;

  return (
    <div
      title={item.title}
      className={cn(
        "flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium truncate cursor-pointer transition-opacity hover:opacity-75",
        !isEvent && item.color_class,
        !isEvent && item.text_class,
      )}
      style={
        isEvent
          ? { backgroundColor: `${item.colour}22`, color: item.colour }
          : undefined
      }
    >
      {item.type === "task-due" ? (
        <CheckSquareIcon className="size-2.5 shrink-0 opacity-60" />
      ) : (
        <span className="size-1.5 rounded-full shrink-0 opacity-70" style={{ backgroundColor: item.colour }} />
      )}
      <span className="truncate leading-tight">{item.title}</span>
    </div>
  );
}
