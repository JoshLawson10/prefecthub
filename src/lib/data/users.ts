import { User, UserRole } from "@/lib/schemas";

export async function getCurrentUser(): Promise<User | null> {
  return null;
}

export async function getUser(userId: string): Promise<User | null> {
  return null;
}

export async function getWorkspaceMembers(): Promise<User[]> {
  return null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return null;
}

export async function getUserRole(): Promise<UserRole | null> {
  return null;
}
