import { createQueryClient } from "@/lib/supabase/query";
import {
  type UserNotificationPreferences,
  DefaultNotificationPreferences,
} from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";

export async function getNotificationPreferences(): Promise<
  Omit<UserNotificationPreferences, "user_id" | "updated_at">
> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) return DefaultNotificationPreferences;

  const { data } = await supabase
    .from("user_notification_preferences")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (!data) return DefaultNotificationPreferences;

  const { user_id: _uid, updated_at: _ua, ...prefs } = data;
  return prefs;
}
