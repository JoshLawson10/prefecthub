import { StatCard } from "@/components/dashboard/stat-card";
import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/components/ui/info-table";
import { NewEventDialog } from "@/components/dashboard/new-event-dialog";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  MailIcon,
  CheckSquareIcon,
  UsersRoundIcon,
} from "lucide-react";

const events = [
  {
    id: "1",
    icon: "#4A90D9",
    title: "Prefect Afternoon Tea",
    description: [
      { label: "Fri 30 May", icon: <CalendarIcon /> },
      { label: "Hall B", icon: <MapPinIcon /> },
      { label: "~150 attendees", icon: <UsersIcon /> },
    ],
    badgeContent: "17d",
    href: "/events/1",
  },
  {
    id: "2",
    icon: "#E8A838",
    title: "Yr 12 Assembly",
    description: [
      { label: "Mon 26 May", icon: <CalendarIcon /> },
      { label: "Hall A", icon: <MapPinIcon /> },
    ],
    badgeContent: "13d",
    href: "/events/2",
  },
  {
    id: "3",
    icon: "#3DAA6B",
    title: "Yr 7 Orientation Day",
    description: [
      { label: "Wed 18 Jun", icon: <CalendarIcon /> },
      { label: "Quad", icon: <MapPinIcon /> },
    ],
    badgeContent: "36d",
    href: "/events/3",
  },
  {
    id: "4",
    icon: "#C0392B",
    title: "Farewell Ceremony",
    description: [
      { label: "Fri 20 Jun", icon: <CalendarIcon /> },
      { label: "2:00 PM", icon: <ClockIcon /> },
      { label: "Auditorium", icon: <MapPinIcon /> },
    ],
    badgeContent: "38d",
    href: "/events/4",
  },
];

const tasks = [
  {
    id: 1,
    title: "Book catering for PAT",
    description: [{ label: "Prefect Afternoon Tea" }, { label: "Josh L." }],
    badgeContent: "3d late",
    badgeVariant: "destructive" as const,
    href: "/events/1/tasks",
  },
  {
    id: 2,
    title: "Confirm guest speakers for Assembly",
    description: [{ label: "Yr 12 Assembly" }, { label: "Emily R." }],
    badgeContent: "Due today",
    badgeVariant: "destructive" as const,
    href: "/events/2/tasks",
  },
  {
    id: 3,
    title: "Organise seating for Orientation Day",
    description: [{ label: "Yr 7 Orientation Day" }, { label: "Liam K." }],
    badgeContent: "Due in 5d",
    badgeVariant: "default" as const,
    href: "/events/3/tasks",
  },
  {
    id: 4,
    title: "Print programs for Farewell Ceremony",
    description: [{ label: "Farewell Ceremony" }, { label: "Sophia M." }],
    badgeContent: "Due in 7d",
    badgeVariant: "default" as const,
    href: "/events/4/tasks",
  },
];

const activity = [
  {
    id: 1,
    icon: <MailIcon />,
    title: "Email logged — PAT catering budget approval",
    description: [
      { label: "Prefect Afternoon Tea" },
      { label: "Josh Lawson" },
      { label: "12 May" },
    ],
    badgeContent: "Email",
    badgeVariant: "secondary" as const,
  },
  {
    id: 2,
    icon: <CheckSquareIcon />,
    title: "Task completed — Draft P&C funding letter",
    description: [
      { label: "Prefect Afternoon Tea" },
      { label: "Josh Lawson" },
      { label: "11 May" },
    ],
    badgeContent: "Done",
    badgeVariant: "outline" as const,
  },
  {
    id: 3,
    icon: <UsersRoundIcon />,
    title: "Meeting logged — Weekly prefect check-in",
    description: [
      { label: "General" },
      { label: "Sophie Nguyen" },
      { label: "9 May" },
    ],
    badgeContent: "Meeting",
    badgeVariant: "secondary" as const,
  },
];

export default async function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" actions={<NewEventDialog />} />
      <Separator className="my-4" />

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          description="Upcoming Events"
          title="4"
          footerDescription="Next: PAT, Fri 30 May"
        />
        <StatCard
          description="Open Tasks"
          title="11"
          footerDescription="Across all events"
        />
        <StatCard
          description="Overdue"
          title="3"
          variant="destructive"
          footerDescription="Needs attention"
        />
        <StatCard
          description="Team Members"
          title="18"
          footerDescription="2 Admins · 16 Prefects"
        />
      </div>

      <div className="mt-6 flex gap-4">
        <Table
          className="flex-1"
          title="Upcoming Events"
          items={events}
          maxItems={4}
          viewAllPath="/events"
        />
        <Table
          className="flex-1"
          title="Open Tasks"
          items={tasks}
          maxItems={4}
          viewAllPath="/tasks"
        />
      </div>

      <div className="mt-6">
        <Table
          title="Recent Activity"
          items={activity}
          maxItems={5}
          viewAllPath="/notifications"
        />
      </div>
    </div>
  );
}
