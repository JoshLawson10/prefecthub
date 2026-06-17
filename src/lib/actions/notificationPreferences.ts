"use server";

import { createQueryClient } from "@/lib/supabase/query";
import { getCurrentUser } from "@/lib/data/users";
import {
  UserNotificationPreferencesSchema,
  type UserNotificationPreferences,
} from "@/lib/schemas";
import { revalidatePath } from "next/cache";

type PrefsInput = Omit<UserNotificationPreferences, "user_id" | "updated_at">;

export async function saveNotificationPreferences(
  prefs: PrefsInput,
): Promise<void> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  UserNotificationPreferencesSchema.omit({
    user_id: true,
    updated_at: true,
  }).parse(prefs);

  const { error } = await supabase.from("user_notification_preferences").upsert(
    {
      user_id: currentUser.id,
      ...prefs,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw new Error(error.message);
  revalidatePath("/settings/notifications");
}
