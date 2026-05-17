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

type TimelineItemType =
  | "event_created"
  | "task_created"
  | "task_completed"
  | "task_overdue"
  | "email"
  | "meeting"
  | "phone"
  | "note_created"
  | "document_uploaded";

interface TimelineEntry {
  id: string;
  type: TimelineItemType;
  title: string;
  meta: string;
  authorInitials: string;
  timestamp: string;
  eventId: string;
}

const ALL_ENTRIES: TimelineEntry[] = [
  {
    id: "tl1",
    type: "task_overdue",
    title: "Task overdue — Book catering for PAT",
    meta: "Assigned to Josh Lawson · High priority",
    authorInitials: "JL",
    timestamp: "13 May",
    eventId: "1",
  },
  {
    id: "tl2",
    type: "email",
    title: "Email logged — PAT catering budget approval",
    meta: "Contact: Ms Carter · Logged by Josh Lawson",
    authorInitials: "JL",
    timestamp: "12 May",
    eventId: "1",
  },
  {
    id: "tl3",
    type: "task_completed",
    title: "Task completed — Draft P&C funding letter",
    meta: "Completed by Josh Lawson",
    authorInitials: "JL",
    timestamp: "11 May",
    eventId: "1",
  },
  {
    id: "tl4",
    type: "document_uploaded",
    title: "Document uploaded — PAT_RunSheet_v2.pdf",
    meta: "Uploaded by Josh Lawson · 248 KB",
    authorInitials: "JL",
    timestamp: "11 May",
    eventId: "1",
  },
  {
    id: "tl5",
    type: "phone",
    title: "Phone call — Hall B booking confirmed",
    meta: "Contact: Mrs Patel · Logged by Josh Lawson",
    authorInitials: "JL",
    timestamp: "8 May",
    eventId: "1",
  },
  {
    id: "tl6",
    type: "note_created",
    title: "Note created — Decoration checklist",
    meta: "By Mia Thompson",
    authorInitials: "MT",
    timestamp: "7 May",
    eventId: "1",
  },
  {
    id: "tl7",
    type: "meeting",
    title: "Meeting — PAT planning, prefect body",
    meta: "All prefects · Logged by Sophie Nguyen",
    authorInitials: "SN",
    timestamp: "5 May",
    eventId: "1",
  },
  {
    id: "tl8",
    type: "event_created",
    title: "Event created — Prefect Afternoon Tea",
    meta: "Created by Josh Lawson",
    authorInitials: "JL",
    timestamp: "1 May",
    eventId: "1",
  },
  {
    id: "tl9",
    type: "meeting",
    title: "Meeting — Assembly AV requirements",
    meta: "AV team · Logged by Mia Thompson",
    authorInitials: "MT",
    timestamp: "4 May",
    eventId: "2",
  },
  {
    id: "tl10",
    type: "event_created",
    title: "Event created — Yr 12 Assembly",
    meta: "Created by Sophie Nguyen",
    authorInitials: "SN",
    timestamp: "1 May",
    eventId: "2",
  },
];

const ENTRY_CONFIG: Record<
  TimelineItemType,
  {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
  }
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
  eventId?: string;
}

export function TimelineView({ eventId }: TimelineViewProps) {
  const entries = eventId
    ? ALL_ENTRIES.filter((e) => e.eventId === eventId)
    : ALL_ENTRIES;

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
                    <AvatarFallback>{entry.authorInitials}</AvatarFallback>
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
