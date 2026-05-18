"use client";

import { useState } from "react";
import {
  CheckSquareIcon,
  MailIcon,
  CalendarPlusIcon,
  AlertCircleIcon,
  TicketIcon,
  UserPlusIcon,
  BellOffIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type NotificationType =
  | "task_overdue"
  | "task_assigned"
  | "task_completed"
  | "rsvp"
  | "event_created"
  | "correspondence"
  | "member_added";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  eventId?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "task_overdue",   title: "Task overdue",      description: "Book catering for PAT — assigned to you · Prefect Afternoon Tea",      timestamp: "Today",    read: false, eventId: "1" },
  { id: "n2", type: "rsvp",           title: "New RSVP",          description: "Emily Zhang submitted an RSVP for Prefect Afternoon Tea (2 guests)",   timestamp: "Today",    read: false, eventId: "1" },
  { id: "n3", type: "task_assigned",  title: "Task assigned",     description: "Design RSVP form — assigned by Sophie Nguyen · Due 22 May",            timestamp: "12 May",   read: false, eventId: "1" },
  { id: "n4", type: "task_completed", title: "Task completed",    description: "Draft P&C funding letter — completed by Josh Lawson",                  timestamp: "11 May",   read: true,  eventId: "1" },
  { id: "n5", type: "correspondence", title: "Correspondence logged", description: "Email logged — PAT catering budget approval · Prefect Afternoon Tea", timestamp: "12 May", read: true,  eventId: "1" },
  { id: "n6", type: "event_created",  title: "New event created", description: "Farewell Ceremony added for Fri 20 Jun · Created by Sophie Nguyen",    timestamp: "10 May",   read: true  },
  { id: "n7", type: "task_overdue",   title: "Task overdue",      description: "Confirm AV equipment for assembly — assigned to Alex Kim",             timestamp: "9 May",    read: true,  eventId: "2" },
  { id: "n8", type: "member_added",   title: "Member joined",     description: "Emma Chen joined the workspace",                                        timestamp: "5 Feb",    read: true  },
];

const TYPE_CONFIG: Record<NotificationType, {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}> = {
  task_overdue:   { icon: <AlertCircleIcon  className="size-4" />, iconBg: "bg-destructive/10", iconColor: "text-destructive"                       },
  task_assigned:  { icon: <CheckSquareIcon  className="size-4" />, iconBg: "bg-primary/10",     iconColor: "text-primary"                           },
  task_completed: { icon: <CheckSquareIcon  className="size-4" />, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
  rsvp:           { icon: <TicketIcon       className="size-4" />, iconBg: "bg-blue-500/10",    iconColor: "text-blue-600 dark:text-blue-400"       },
  event_created:  { icon: <CalendarPlusIcon className="size-4" />, iconBg: "bg-violet-500/10",  iconColor: "text-violet-600 dark:text-violet-400"   },
  correspondence: { icon: <MailIcon         className="size-4" />, iconBg: "bg-amber-500/10",   iconColor: "text-amber-600 dark:text-amber-400"     },
  member_added:   { icon: <UserPlusIcon     className="size-4" />, iconBg: "bg-muted",          iconColor: "text-muted-foreground"                  },
};

export function NotificationsView() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col rounded-xl border border-border overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <BellOffIcon className="size-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">You're all caught up</p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const config = TYPE_CONFIG[notif.type];
            return (
              <div key={notif.id}>
                {i > 0 && <Separator />}
                <div
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    "flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors",
                    !notif.read
                      ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
                      : "hover:bg-muted/40",
                  )}
                >
                  {/* Unread dot */}
                  <div className="mt-1 flex size-2 shrink-0 items-center justify-center">
                    {!notif.read && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                      config.iconBg,
                    )}
                  >
                    <span className={config.iconColor}>{config.icon}</span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        !notif.read ? "font-semibold" : "font-medium",
                      )}
                    >
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {notif.description}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums mt-0.5">
                    {notif.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
