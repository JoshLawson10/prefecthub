import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import type { CalendarItem } from "./calendar-view";
import { EventChip } from "./event-chip";

export function DayCell({
  day,
  items,
  isCurrentMonth,
  isSelected,
  onSelect,
}: {
  day: Date;
  items: CalendarItem[];
  isCurrentMonth: boolean;
  isSelected: boolean;
  onSelect: (d: Date) => void;
}) {
  const today = isToday(day);
  const MAX_CHIPS = 3;
  const overflow = Math.max(0, items.length - MAX_CHIPS);

  return (
    <div
      onClick={() => onSelect(day)}
      className={cn(
        "min-h-24 p-1.5 flex flex-col gap-0.5 border-t border-border cursor-pointer transition-colors",
        "hover:bg-muted/30",
        isSelected && "bg-muted/50",
        !isCurrentMonth && "opacity-35",
      )}
    >
      <div className="flex justify-end mb-0.5">
        <span
          className={cn(
            "size-6 flex items-center justify-center rounded-full text-xs font-medium select-none transition-colors",
            today && "bg-primary text-primary-foreground font-semibold",
            !today && isSelected && "ring-2 ring-primary/40",
            !today && !isSelected && "text-foreground",
          )}
        >
          {format(day, "d")}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 overflow-hidden">
        {items.slice(0, MAX_CHIPS).map((item) => (
          <EventChip key={item.id} item={item} />
        ))}
        {overflow > 0 && (
          <span className="text-[11px] text-muted-foreground px-1.5 leading-tight">
            +{overflow} more
          </span>
        )}
      </div>
    </div>
  );
}
