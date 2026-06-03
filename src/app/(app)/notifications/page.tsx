import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { NotificationsView } from "@/components/notifications/notifications-view";
import { getNotifications } from "@/lib/data/notifications";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div>
      <Header title="Notifications" />
      <Separator className="my-4" />
      <NotificationsView initialNotifications={notifications} />
    </div>
  );
}
