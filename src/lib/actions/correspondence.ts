import type { CorrespondenceLog } from "@/types/database";

export async function createCorrespondence(
  data: Omit<CorrespondenceLog, "id" | "created_at">,
): Promise<CorrespondenceLog | null> {
  return null;
}

export async function updateCorrespondence(
  logId: string,
  data: Partial<CorrespondenceLog>,
): Promise<CorrespondenceLog | null> {
  return null;
}

export async function deleteCorrespondence(logId: string): Promise<null> {
  return null;
}

export async function emailCorrespondence(
  logId: string,
  recipientEmail: string,
): Promise<null> {
  return null;
}
