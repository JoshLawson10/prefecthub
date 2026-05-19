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
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { NotificationDetailSheet } from "@/components/notifications/notification-detail-sheet";
import type { Notification, NotificationType } from "@/types";

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; iconBg: string; iconColor: string }
> = {
  task_overdue: {
    icon: <AlertCircleIcon className="size-4" />,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  task_assigned: {
    icon: <CheckSquareIcon className="size-4" />,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  task_completed: {
    icon: <CheckSquareIcon className="size-4" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  rsvp: {
    icon: <TicketIcon className="size-4" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  event_created: {
    icon: <CalendarPlusIcon className="size-4" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  correspondence: {
    icon: <MailIcon className="size-4" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  member_added: {
    icon: <UserPlusIcon className="size-4" />,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
};

interface NotificationsViewProps {
  initialNotifications: Notification[];
}

export function NotificationsView({ initialNotifications }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selected, setSelected]           = useState<Notification | null>(null);
  const [sheetOpen, setSheetOpen]         = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function openDetail(notif: Notification) {
    // Mark read immediately when opened
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
    );
    setSelected({ ...notif, read: true });
    setSheetOpen(true);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <>
      <div className="flex flex-col gap-4 max-w-2xl">
        {/* Toolbar */}
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
                  <button
                    type="button"
                    onClick={() => openDetail(notif)}
                    className={cn(
                      "flex w-full items-start gap-4 px-5 py-4 text-left transition-colors",
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

                    {/* Type icon */}
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
                      {notif.event_title && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {notif.event_title}
                        </p>
                      )}
                    </div>

                    {/* Right side — timestamp + chevron */}
                    <div className="flex shrink-0 flex-col items-end gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {notif.timestamp}
                      </span>
                      <ChevronRightIcon className="size-4 text-muted-foreground/40" />
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail sheet */}
      <NotificationDetailSheet
        notification={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
