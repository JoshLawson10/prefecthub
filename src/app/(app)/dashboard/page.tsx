import { StatCard } from "@/components/dashboard/stat-card";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

export default async function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <StatCard
          description="Total Revenue"
          title="$1,250.00"
          badgeIcon={<TrendingUpIcon />}
          badgeLabel="+12.5%"
          footerTitle="Trending up this month"
          footerIcon={<TrendingUpIcon className="size-4" />}
          footerDescription="Visitors for the last 6 months"
        />

        <StatCard
          description="New Customers"
          title="1,234"
          badgeIcon={<TrendingDownIcon />}
          badgeLabel="-20%"
          footerTitle="Down 20% this period"
          footerIcon={<TrendingDownIcon className="size-4" />}
          footerDescription="Acquisition needs attention"
        />

        <StatCard
          description="Active Accounts"
          title="45,678"
          badgeIcon={<TrendingUpIcon />}
          badgeLabel="+12.5%"
          footerTitle="Strong user retention"
          footerIcon={<TrendingUpIcon className="size-4" />}
          footerDescription="Engagement exceed targets"
        />

        <StatCard
          description="Growth Rate"
          title="4.5%"
          badgeIcon={<TrendingUpIcon />}
          badgeLabel="+4.5%"
          footerTitle="Steady performance increase"
          footerIcon={<TrendingUpIcon className="size-4" />}
          footerDescription="Meets growth projections"
        />
      </div>
    </div>
  );
}
