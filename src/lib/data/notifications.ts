import type { Notification, Pagination } from "@/lib/schemas";

export async function getUserNotifications(
  pagination?: Pagination,
): Promise<Notification[] | null> {
  return null;
}

export async function getUnreadNotificationCount(): Promise<number | null> {
  return null;
}

export async function getNotification(
  notificationId: string,
): Promise<Notification | null> {
  return null;
}
