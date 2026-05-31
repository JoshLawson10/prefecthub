"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/users";
import type { LogType } from "@/types";

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
  const supabase = await createClient();
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
}

export async function deleteCorrespondenceLog(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("correspondence_logs")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
