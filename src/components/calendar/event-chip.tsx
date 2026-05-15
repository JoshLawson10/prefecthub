import type { CalendarItem } from "./calendar-view";
import { cn } from "@/lib/utils";
import { CheckSquareIcon } from "lucide-react";

export function EventChip({ item }: { item: CalendarItem }) {
  return (
    <div
      title={item.title}
      className={cn(
        "flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium truncate cursor-pointer transition-opacity hover:opacity-75",
        item.colorClass,
        item.textClass,
      )}
    >
      {item.type === "task-due" ? (
        <CheckSquareIcon className="size-2.5 shrink-0 opacity-60" />
      ) : (
        <span className="size-1.5 rounded-full bg-current shrink-0 opacity-60" />
      )}
      <span className="truncate leading-tight">{item.title}</span>
    </div>
  );
}
