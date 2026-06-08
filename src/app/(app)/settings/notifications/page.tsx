import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data/users";
import { getNotificationPreferences } from "@/lib/data/notificationPreferences";
import { NotificationsForm } from "@/components/settings/notifications-form";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const preferences = await getNotificationPreferences();

  return <NotificationsForm initialPreferences={preferences} />;
}
