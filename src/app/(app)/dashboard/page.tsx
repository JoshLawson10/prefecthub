import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  MailIcon,
  CheckSquareIcon,
  UsersRoundIcon,
  AlertCircleIcon,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/components/ui/info-table";
import { NewEventDialog } from "@/components/dashboard/new-event-dialog";
import { getEvents, getDashboardStats } from "@/lib/data/events";
import { getTasks } from "@/lib/data/tasks";
import { getNotifications } from "@/lib/data/notifications";
import { countMembersByType } from "@/lib/data/members";
import { differenceInCalendarDays, parseISO } from "date-fns";

const EVENT_COLOURS: Record<string, string> = {
  "1": "#4A90D9",
  "2": "#E8A838",
  "3": "#3DAA6B",
  "4": "#C0392B",
};

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  task_overdue: "Overdue",
  task_assigned: "Assigned",
  task_completed: "Done",
  rsvp: "RSVP",
  event_created: "Event",
  correspondence: "Email",
  member_added: "Member",
};

export default function DashboardPage() {
  const stats = getDashboardStats();
  const memberCounts = countMembersByType();
  const adminCount = memberCounts["admin"] ?? 0;
  const prefectCount = memberCounts["prefect"] ?? 0;

  const today = new Date();

  const upcomingEvents = getEvents()
    .filter((e) => e.status === "upcoming")
    .slice(0, 4)
    .map((e) => {
      const daysUntil = differenceInCalendarDays(parseISO(e.dateSort), today);
      const daysLabel =
        daysUntil === 0
          ? "Today"
          : daysUntil === 1
            ? "Tomorrow"
            : `${daysUntil}d`;
      return {
        id: e.id,
        icon: EVENT_COLOURS[e.id] ?? "#888",
        title: e.title,
        description: [
          { label: e.date, icon: <CalendarIcon /> },
          { label: e.location, icon: <MapPinIcon /> },
          ...(e.max_capacity
            ? [{ label: `~${e.max_capacity} cap`, icon: <UsersIcon /> }]
            : []),
        ],
        badgeContent: daysLabel,
        href: `/events/${e.id}`,
      };
    });

  const openTasks = getTasks()
    .filter((t) => t.status !== "done")
    .sort((a, b) => {
      const aOver = a.status === "overdue" ? 0 : 1;
      const bOver = b.status === "overdue" ? 0 : 1;
      if (aOver !== bOver) return aOver - bOver;
      return (a.due_date_sort ?? "").localeCompare(b.due_date_sort ?? "");
    })
    .slice(0, 4)
    .map((t) => ({
      id: t.id,
      icon:
        t.status === "overdue" ? (
          <AlertCircleIcon className="text-destructive" />
        ) : (
          <CheckSquareIcon className="text-muted-foreground" />
        ),
      title: t.title,
      description: [
        { label: t.event_title },
        ...(t.assignee_name ? [{ label: t.assignee_name }] : []),
      ],
      badgeContent:
        t.status === "overdue"
          ? `${differenceInCalendarDays(today, parseISO(t.due_date_sort!))}d late`
          : (t.due_date ?? "No date"),
      badgeVariant: (t.status === "overdue" ? "destructive" : "secondary") as
        | "destructive"
        | "secondary",
      href: `/events/${t.event_id}/tasks`,
    }));

  const recentActivity = getNotifications()
    .slice(0, 5)
    .map((n) => ({
      id: n.id,
      icon:
        n.type === "correspondence" || n.type === "rsvp" ? (
          <MailIcon />
        ) : n.type === "task_completed" ? (
          <CheckSquareIcon />
        ) : n.type === "member_added" ? (
          <UsersRoundIcon />
        ) : (
          <AlertCircleIcon />
        ),
      title: n.description,
      description: [
        ...(n.event_title ? [{ label: n.event_title }] : []),
        { label: n.timestamp },
      ],
      badgeContent: NOTIFICATION_TYPE_LABELS[n.type] ?? n.type,
      badgeVariant: "secondary" as const,
      href: n.action?.href,
    }));

  return (
    <div>
      <Header title="Dashboard" actions={<NewEventDialog />} />
      <Separator className="my-4" />

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          description="Upcoming Events"
          title={stats.upcoming_events}
          footerDescription={
            upcomingEvents[0]
              ? `Next: ${upcomingEvents[0].title}`
              : "No upcoming events"
          }
        />
        <StatCard
          description="Open Tasks"
          title={stats.open_tasks}
          footerDescription="Across all events"
        />
        <StatCard
          description="Overdue"
          title={stats.overdue_tasks}
          variant={stats.overdue_tasks > 0 ? "destructive" : "default"}
          footerDescription={
            stats.overdue_tasks > 0 ? "Needs attention" : "All up to date"
          }
        />
        <StatCard
          description="Team Members"
          title={stats.total_members}
          footerDescription={`${adminCount} Admin${adminCount !== 1 ? "s" : ""} · ${prefectCount} Prefect${prefectCount !== 1 ? "s" : ""}`}
        />
      </div>

      <div className="mt-6 flex gap-4">
        <Table
          className="flex-1"
          title="Upcoming Events"
          items={upcomingEvents}
          maxItems={4}
          viewAllPath="/events"
        />
        <Table
          className="flex-1"
          title="Open Tasks"
          items={openTasks}
          maxItems={4}
          viewAllPath="/tasks"
        />
      </div>

      <div className="mt-6">
        <Table
          title="Recent Activity"
          items={recentActivity}
          maxItems={5}
          viewAllPath="/notifications"
        />
      </div>
    </div>
  );
}
