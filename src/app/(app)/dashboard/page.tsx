import { StatCard } from "@/components/dashboard/stat-card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { PlusIcon, BellIcon } from "lucide-react";
import { Table } from "@/components/ui/info-table";
import { Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";

const events = [
  {
    id: 1,
    icon: "#4A90D9",
    title: "Prefect Afternoon Tea",
    description: [
      { label: "Fri 30 May", icon: <CalendarIcon /> },
      { label: "Hall B", icon: <MapPin /> },
      { label: "~150 attendees", icon: <Users /> },
    ],
    badgeContent: "17d",
  },
  {
    id: 2,
    icon: "#E8A838",
    title: "Yr 12 Assembly",
    description: [
      { label: "Mon 26 May", icon: <CalendarIcon /> },
      { label: "Hall A", icon: <MapPin /> },
    ],
    badgeContent: "13d",
  },
  {
    id: 3,
    icon: "#3DAA6B",
    title: "Yr 7 Orientation Day",
    description: [
      { label: "Wed 18 Jun", icon: <CalendarIcon /> },
      { label: "Quad", icon: <MapPin /> },
    ],
    badgeContent: "36d",
  },
  {
    id: 4,
    icon: "#C0392B",
    title: "Farewell Ceremony",
    description: [
      { label: "Fri 20 Jun", icon: <CalendarIcon /> },
      { label: "2:00 PM", icon: <Clock /> },
      { label: "Auditorium", icon: <MapPin /> },
    ],
    badgeContent: "38d",
  },
];

const tasks = [
  {
    id: 1,
    title: "Book catering for PAT",
    description: [{ label: "Prefect Afternoon Tea" }, { label: "Josh L" }],
    badgeContent: "3d late",
    badgeVariant: "destructive" as const,
  },
  {
    id: 2,
    title: "Confirm guest speakers for Assembly",
    description: [{ label: "Yr 12 Assembly" }, { label: "Emily R" }],
    badgeContent: "Due today",
    badgeVariant: "destructive" as const,
  },
  {
    id: 3,
    title: "Organise seating for Orientation Day",
    description: [{ label: "Yr 7 Orientation Day" }, { label: "Liam K" }],
    badgeContent: "Due in 5d",
    badgeVariant: "default" as const,
  },
  {
    id: 4,
    title: "Print programs for Farewell Ceremony",
    description: [{ label: "Farewell Ceremony" }, { label: "Sophia M" }],
    badgeContent: "Due in 7d",
    badgeVariant: "default" as const,
  },
];

export default async function DashboardPage() {
  return (
    <div>
      <Header
        title="Dashboard"
        actions={
          <>
            <Button variant="outline">
              <BellIcon />
            </Button>
            <Button>
              <PlusIcon /> New event
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <StatCard
          description="Upcoming Events"
          title="4"
          footerDescription="Next: PAT, Fri, 30 May"
        />

        <StatCard
          description="Open Tasks"
          title="11"
          footerDescription="Accross all events"
        />

        <StatCard
          description="Overdue"
          title="3"
          footerDescription="Needs attention"
        />

        <StatCard
          description="Team Members"
          title="18"
          footerDescription="2 Admins · 16 Prefects"
        />
      </div>
      <div className="mt-8 flex gap-4">
        <Table className="flex-1" title="Upcoming Events" items={events} />
        <Table className="flex-1" title="Open Tasks" items={tasks} />
      </div>
    </div>
  );
}
