import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import {
  type UserNotificationPreferences,
  DefaultNotificationPreferences,
} from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";

/**
 * Returns the current user's notification preferences.
 * If no row exists yet (first visit), returns the schema defaults without
 * writing to the DB the upsert in saveNotificationPreferences handles that.
 */
export const getNotificationPreferences = cache(
  async (): Promise<
    Omit<UserNotificationPreferences, "user_id" | "updated_at">
  > => {
    const supabase = await createClient();
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
  },
);
