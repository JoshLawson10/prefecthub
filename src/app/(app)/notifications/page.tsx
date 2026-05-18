import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { NotificationsView } from "@/components/notifications/notifications-view";

export default function NotificationsPage() {
  return (
    <div>
      <Header title="Notifications" />
      <Separator className="my-4" />
      <NotificationsView />
    </div>
  );
}
