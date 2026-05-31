import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { CorrespondenceLog } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";

const LOG_SELECT = `
  *,
  logged_by_user:users!logged_by(full_name, initials)
`;

export const getCorrespondence = cache(
  async (logId: string): Promise<CorrespondenceLog | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("correspondence_logs")
      .select(LOG_SELECT)
      .eq("id", logId)
      .single();
    if (error) return null;
    return data;
  },
);

export async function getEventCorrespondence(
  eventId: string,
): Promise<CorrespondenceLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("correspondence_logs")
    .select(LOG_SELECT)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching event correspondence:", error);
    return [];
  }
  return data;
}

export const getCorrespondenceByEvent = getEventCorrespondence;
export const getCorrespondenceByEventId = getEventCorrespondence;

export async function getCorrespondenceByContact(
  eventId: string,
  email: string,
): Promise<CorrespondenceLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("correspondence_logs")
    .select(LOG_SELECT)
    .eq("event_id", eventId)
    .eq("contact_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching correspondence by contact:", error);
    return [];
  }
  return data;
}

export async function searchCorrespondence(
  query: string,
): Promise<CorrespondenceLog[]> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const q = `%${query}%`;
  const { data, error } = await supabase
    .from("correspondence_logs")
    .select(LOG_SELECT)
    .eq("workspace_id", currentUser.workspace_id)
    .or(`subject.ilike.${q},contact_name.ilike.${q},body.ilike.${q}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching correspondence:", error);
    return [];
  }
  return data;
}
