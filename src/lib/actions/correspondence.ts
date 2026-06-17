"use server";

import { createQueryClient } from "@/lib/supabase/query";
import { getCurrentUser } from "@/lib/data/users";
import { revalidatePath } from "next/cache";
import type { LogType } from "@/lib/schemas";

export interface LogCorrespondenceInput {
  eventId: string;
  type: LogType;
  subject: string;
  body: string;
  contactName: string;
  contactEmail: string | null;
}

export async function logCorrespondence(
  input: LogCorrespondenceInput,
): Promise<void> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase.from("correspondence_logs").insert({
    event_id: input.eventId,
    type: input.type,
    subject: input.subject,
    body: input.body,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    logged_by: currentUser.id,
    workspace_id: currentUser.workspace_id,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/events/${input.eventId}/correspondence`);
}

export async function deleteCorrespondenceLog(id: string): Promise<void> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { data: log } = await supabase
    .from("correspondence_logs")
    .select("event_id")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("correspondence_logs")
    .delete()
    .eq("id", id)
    .eq("workspace_id", currentUser.workspace_id);
  if (error) throw new Error(error.message);

  if (log?.event_id) revalidatePath(`/events/${log.event_id}/correspondence`);
}
