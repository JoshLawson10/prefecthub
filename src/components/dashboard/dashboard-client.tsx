"use client";

import {
  CalendarIcon,
  MapPinIcon,
  CheckSquareIcon,
  AlertCircleIcon,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/components/ui/info-table";
import { NewEventDialog } from "@/components/dashboard/new-event-dialog";

const iconMap = {
  calendar: CalendarIcon,
  "map-pin": MapPinIcon,
};

interface DashboardClientProps {
  stats: {
    upcomingEvents: number;
    openTasksCount: number;
    completedTasks: number;
    totalTasks: number;
    overdueTasks: number;
    totalMembers: number;
    activeMembers: number;
  };
  upcomingEvents: Array<{
    id: string;
    title: string;
    description: Array<{ label: string; icon: string }>;
    badgeContent: string;
    href: string;
  }>;
  openTasks: Array<{
    id: string;
    status: string;
    title: string;
    description: Array<{ label: string }>;
    badgeContent: string;
    badgeVariant: "destructive" | "secondary";
    href: string;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    description: Array<{ label: string }>;
    badgeContent: string;
    badgeVariant: "secondary";
  }>;
  memberSummaryParts: string[];
  nextEventTitle?: string;
}

export function DashboardClient({
  stats,
  upcomingEvents,
  openTasks,
  recentActivity,
  memberSummaryParts,
  nextEventTitle,
}: DashboardClientProps) {
  const upcomingEventsWithIcons = upcomingEvents.map((event) => ({
    ...event,
    description: event.description.map((item) => {
      const Icon = iconMap[item.icon as keyof typeof iconMap];
      return { label: item.label, icon: Icon ? <Icon /> : null };
    }),
  }));

  const openTasksWithIcons = openTasks.map((task) => ({
    ...task,
    icon:
      task.status === "overdue" ? (
        <AlertCircleIcon className="text-destructive" />
      ) : (
        <CheckSquareIcon className="text-muted-foreground" />
      ),
  }));

  return (
    <div>
      <Header title="Dashboard" actions={<NewEventDialog />} />
      <Separator className="my-4" />

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          description="Upcoming Events"
          title={stats.upcomingEvents}
          footerDescription={
            nextEventTitle ? `Next: ${nextEventTitle}` : "No upcoming events"
          }
        />
        <StatCard
          description="Open Tasks"
          title={stats.openTasksCount}
          footerDescription={`${stats.completedTasks} completed of ${stats.totalTasks} total`}
        />
        <StatCard
          description="Overdue"
          title={stats.overdueTasks}
          variant={stats.overdueTasks > 0 ? "destructive" : "default"}
          footerDescription={
            stats.overdueTasks > 0 ? "Needs attention" : "All up to date"
          }
        />
        <StatCard
          description="Team Members"
          title={stats.totalMembers}
          footerDescription={memberSummaryParts.join(" · ")}
        />
      </div>

      <div className="mt-6 flex gap-4">
        <Table
          className="flex-1"
          title="Upcoming Events"
          items={upcomingEventsWithIcons}
          maxItems={4}
          viewAllPath="/events"
        />
        <Table
          className="flex-1"
          title="Open Tasks"
          items={openTasksWithIcons}
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
