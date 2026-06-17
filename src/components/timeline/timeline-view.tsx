import {
  CheckSquareIcon,
  MailIcon,
  FileUpIcon,
  StickyNoteIcon,
  CalendarPlusIcon,
  AlertCircleIcon,
  UsersIcon,
  PhoneIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TimelineEntry, TimelineItemType } from "@/lib/schemas";

const ENTRY_CONFIG: Record<
  TimelineItemType,
  { icon: React.ReactNode; iconBg: string; iconColor: string }
> = {
  event_created: {
    icon: <CalendarPlusIcon className="size-3.5" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  task_created: {
    icon: <CheckSquareIcon className="size-3.5" />,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  task_completed: {
    icon: <CheckSquareIcon className="size-3.5" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  task_overdue: {
    icon: <AlertCircleIcon className="size-3.5" />,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  email: {
    icon: <MailIcon className="size-3.5" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  meeting: {
    icon: <UsersIcon className="size-3.5" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  phone: {
    icon: <PhoneIcon className="size-3.5" />,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  note_created: {
    icon: <StickyNoteIcon className="size-3.5" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  document_uploaded: {
    icon: <FileUpIcon className="size-3.5" />,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
};

interface TimelineViewProps {
  entries: TimelineEntry[];
}

export function TimelineView({ entries }: TimelineViewProps) {
  const grouped = entries.reduce<Record<string, TimelineEntry[]>>(
    (acc, entry) => {
      (acc[entry.timestamp] ??= []).push(entry);
      return acc;
    },
    {},
  );

  const dateGroups = Object.entries(grouped);

  return (
    <div className="relative flex flex-col gap-0 max-w-2xl">
      <div className="absolute left-4.75 top-0 bottom-0 w-px bg-border" />

      {dateGroups.map(([date, items]) => (
        <div key={date} className="flex flex-col gap-0">
          {/* Date label */}
          <div className="relative flex items-center gap-3 mb-2 mt-4 first:mt-0">
            <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-background ring-2 ring-border shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground text-center leading-tight">
                {date.replace(" ", "\n")}
              </span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              {date}
            </span>
          </div>

          <div className="flex flex-col gap-2 pl-14">
            {items.map((entry) => {
              const config = ENTRY_CONFIG[entry.type];
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
                      config.iconBg,
                    )}
                  >
                    <span className={config.iconColor}>{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">
                      {entry.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.meta}
                    </p>
                  </div>
                  <Avatar size="sm" className="shrink-0">
                    <AvatarFallback>{entry.author_initials}</AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
