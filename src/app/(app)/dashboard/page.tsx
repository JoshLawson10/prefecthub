import { StatCard } from "@/components/dashboard/stat-card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { PlusIcon, BellIcon } from "lucide-react";

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
      <div className="grid grid-cols-4 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
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
    </div>
  );
}
