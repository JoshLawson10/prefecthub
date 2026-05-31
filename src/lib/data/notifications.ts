import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { Notification } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";

export async function getNotifications(
  limit?: number,
): Promise<Notification[]> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data;
}

export async function getUnreadNotifications(): Promise<Notification[]> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("read", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
  return data;
}

export const getUnreadCount = cache(async (): Promise<number> => {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", currentUser.id)
    .eq("read", false);

  if (error) return 0;
  return count ?? 0;
});
