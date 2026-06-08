"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/users";
import type { NotifType } from "@/lib/schemas";

export async function markNotificationRead(
  notificationId: string,
): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", currentUser.id);
  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", currentUser.id)
    .eq("read", false);
  if (error) throw new Error(error.message);
}

export async function deleteNotification(
  notificationId: string,
): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", currentUser.id);
  if (error) throw new Error(error.message);
}

export async function clearAllNotifications(): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", currentUser.id);
  if (error) throw new Error(error.message);
}

export interface CreateNotificationInput {
  userId: string;
  type: NotifType;
  title: string;
  description: string;
  detail?: string;
  eventId?: string;
  actionLabel?: string;
  actionHref?: string;
}

export async function createNotification(
  input: CreateNotificationInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    description: input.description,
    detail: input.detail ?? null,
    event_id: input.eventId ?? null,
    action_label: input.actionLabel ?? null,
    action_href: input.actionHref ?? null,
    read: false,
  });
  if (error) throw new Error(error.message);
}

export async function broadcastNotification(
  input: Omit<CreateNotificationInput, "userId">,
): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) throw new Error("Not authenticated");

  const { data: members, error: membersError } = await supabase
    .from("users")
    .select("id")
    .eq("workspace_id", currentUser.workspace_id);

  if (membersError) throw new Error(membersError.message);
  if (!members || members.length === 0) return;

  const rows = members.map((m) => ({
    user_id: m.id,
    type: input.type,
    title: input.title,
    description: input.description,
    detail: input.detail ?? null,
    event_id: input.eventId ?? null,
    action_label: input.actionLabel ?? null,
    action_href: input.actionHref ?? null,
    read: false,
  }));

  const { error } = await supabase.from("notifications").insert(rows);
  if (error) throw new Error(error.message);
}
