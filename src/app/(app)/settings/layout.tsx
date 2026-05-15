import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { SettingsTabs } from "@/components/settings/settings-tabs";

const tabs = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Appearance", href: "/settings/appearance" },
  { label: "Security", href: "/settings/security" },
  { label: "Teams", href: "/settings/teams" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header title="Settings" />
      <Separator className="my-4" />
      <div className="flex gap-8">
        <SettingsTabs tabs={tabs} />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
