"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  CheckSquareIcon,
  MailIcon,
  CalendarPlusIcon,
  AlertCircleIcon,
  TicketIcon,
  UserPlusIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Notification, NotificationType } from "@/types";

const TYPE_CONFIG: Record<
  NotificationType,
  {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    label: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  task_overdue: {
    icon: <AlertCircleIcon className="size-5" />,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    label: "Task overdue",
    badgeVariant: "destructive",
  },
  task_assigned: {
    icon: <CheckSquareIcon className="size-5" />,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    label: "Task assigned",
    badgeVariant: "default",
  },
  task_completed: {
    icon: <CheckSquareIcon className="size-5" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Task completed",
    badgeVariant: "secondary",
  },
  rsvp: {
    icon: <TicketIcon className="size-5" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "New RSVP",
    badgeVariant: "secondary",
  },
  event_created: {
    icon: <CalendarPlusIcon className="size-5" />,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    label: "Event created",
    badgeVariant: "secondary",
  },
  correspondence: {
    icon: <MailIcon className="size-5" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Correspondence",
    badgeVariant: "secondary",
  },
  member_added: {
    icon: <UserPlusIcon className="size-5" />,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    label: "Member added",
    badgeVariant: "outline",
  },
};

interface NotificationDetailSheetProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDetailSheet({
  notification,
  open,
  onOpenChange,
}: NotificationDetailSheetProps) {
  if (!notification) return null;

  const config = TYPE_CONFIG[notification.type];

  const receivedLabel = notification.received_at
    ? format(parseISO(notification.received_at), "EEEE d MMMM yyyy 'at' h:mm a")
    : notification.timestamp;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-6 py-5 gap-3">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl",
                config.iconBg,
              )}
            >
              <span className={config.iconColor}>{config.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant={config.badgeVariant}>{config.label}</Badge>
                {!notification.read && (
                  <Badge variant="destructive">Unread</Badge>
                )}
              </div>
              <SheetTitle className="text-base leading-snug">
                {notification.title}
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {notification.description}
          </p>

          <Separator />

          {notification.detail && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Details
              </p>
              <p className="text-sm leading-relaxed">{notification.detail}</p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/30 divide-y divide-border overflow-hidden">
            <div className="flex items-start gap-3 px-4 py-3">
              <CalendarIcon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="text-sm mt-0.5">{receivedLabel}</p>
              </div>
            </div>

            {notification.event_title && (
              <div className="flex items-start gap-3 px-4 py-3">
                <CalendarPlusIcon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Event</p>
                  {notification.event_id ? (
                    <Link
                      href={`/events/${notification.event_id}`}
                      className="text-sm mt-0.5 text-primary hover:underline block"
                      onClick={() => onOpenChange(false)}
                    >
                      {notification.event_title}
                    </Link>
                  ) : (
                    <p className="text-sm mt-0.5">{notification.event_title}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 px-4 py-3">
              <span
                className={cn(
                  "mt-0.5 shrink-0 [&>svg]:size-4",
                  config.iconColor,
                )}
              >
                {config.icon}
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm mt-0.5">{config.label}</p>
              </div>
            </div>
          </div>
        </div>

        {notification.action && (
          <div className="border-t px-6 py-4">
            <Button asChild className="w-full gap-2">
              <Link
                href={notification.action.href}
                onClick={() => onOpenChange(false)}
              >
                {notification.action.label}
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
