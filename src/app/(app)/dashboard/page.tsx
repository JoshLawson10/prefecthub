import { getDashboardStats, getRecentActivity } from "@/lib/data/dashboard";
import { getUpcomingEvents } from "@/lib/data/events";
import { getUserTasks } from "@/lib/data/tasks";
import { formatEventDate, formatShortDate } from "@/lib/utils/format";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  task_overdue: "Overdue",
  task_assigned: "Assigned",
  task_completed: "Done",
  rsvp: "RSVP",
  event_created: "Event",
  correspondence: "Email",
  member_added: "Member",
};

export default async function DashboardPage() {
  const today = new Date();

  const [stats, upcomingRaw, tasks, activity] = await Promise.all([
    getDashboardStats(),
    getUpcomingEvents(4),
    getUserTasks(),
    getRecentActivity(5),
  ]);

  const openTasksCount = stats.totalTasks - stats.completedTasks;

  const upcomingEvents = upcomingRaw.map((e) => ({
    id: e.id,
    title: e.title,
    description: [
      { label: formatEventDate(e), icon: "calendar" },
      { label: e.location, icon: "map-pin" },
    ],
    badgeContent:
      differenceInCalendarDays(new Date(e.date_start), today) === 0
        ? "Today"
        : differenceInCalendarDays(new Date(e.date_start), today) === 1
          ? "Tomorrow"
          : `${differenceInCalendarDays(new Date(e.date_start), today)}d`,
    href: `/events/${e.id}`,
  }));

  const openTasksData = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => {
      if (a.status === "overdue" && b.status !== "overdue") return -1;
      if (b.status === "overdue" && a.status !== "overdue") return 1;
      if (a.due_date && b.due_date) {
        return String(a.due_date).localeCompare(String(b.due_date));
      }
      return 0;
    })
    .slice(0, 4)
    .map((t) => ({
      id: t.id,
      status: t.status,
      title: t.title,
      description: [
        {
          label:
            (t as unknown as { event: { title: string } }).event?.title ??
            "No event",
        },
      ],
      badgeContent:
        t.status === "overdue" && t.due_date
          ? `${differenceInCalendarDays(today, parseISO(String(t.due_date)))}d late`
          : t.due_date
            ? formatShortDate(t.due_date)
            : "No date",
      badgeVariant: (t.status === "overdue" ? "destructive" : "secondary") as
        | "destructive"
        | "secondary",
      href: `/events/${t.event_id}/tasks`,
    }));

  const recentActivity = activity.map((a) => ({
    id: a.id,
    title: a.title,
    description: [{ label: a.description }],
    badgeContent: NOTIFICATION_TYPE_LABELS[a.type] ?? a.type,
    badgeVariant: "secondary" as const,
  }));

  const memberSummaryParts = [
    `${stats.totalMembers} total`,
    `${stats.activeMembers} active`,
  ];

  return (
    <DashboardClient
      stats={{
        upcomingEvents: stats.upcomingEvents,
        openTasksCount,
        completedTasks: stats.completedTasks,
        totalTasks: stats.totalTasks,
        overdueTasks: stats.overdueTasks,
        totalMembers: stats.totalMembers,
        activeMembers: stats.activeMembers,
      }}
      upcomingEvents={upcomingEvents}
      openTasks={openTasksData}
      recentActivity={recentActivity}
      memberSummaryParts={memberSummaryParts}
      nextEventTitle={upcomingEvents[0]?.title}
    />
  );
}
