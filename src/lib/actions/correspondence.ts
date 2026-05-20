"use server";

import type { LogType } from "@/types";

export interface LogCorrespondenceInput {
  eventId: string;
  type: LogType;
  subject: string;
  body: string;
  contactName: string;
  contactEmail: string | null;
}

export async function logCorrespondence(input: LogCorrespondenceInput): Promise<void> {
  console.log("[action] logCorrespondence", input);
  // TODO: insert into correspondence_logs table
}

export async function deleteCorrespondenceLog(id: string): Promise<void> {
  console.log("[action] deleteCorrespondenceLog", { id });
  // TODO: delete from correspondence_logs where id = id
}
