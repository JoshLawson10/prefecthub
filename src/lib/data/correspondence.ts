import type { CorrespondenceLog } from "@/lib/schemas";

export async function getCorrespondence(
  logId: string,
): Promise<CorrespondenceLog | null> {
  return null;
}

export async function getEventCorrespondence(
  eventId: string,
): Promise<CorrespondenceLog[] | null> {
  return null;
}

export async function getCorrespondenceByContact(
  eventId: string,
  email: string,
): Promise<CorrespondenceLog[] | null> {
  return null;
}

export async function searchCorrespondence(
  query: string,
): Promise<CorrespondenceLog[] | null> {
  return null;
}
