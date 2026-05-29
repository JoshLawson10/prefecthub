import { User, UserRole, Invitation } from "@/lib/schemas";

export async function updateUserProfile(
  userId: string,
  data: Partial<User>,
): Promise<User> {
  return null;
}

export async function updateUserAvatar(
  userId: string,
  file: File,
): Promise<{ avatar_url: string }> {
  return null;
}
export async function deleteUserAvatar(userId: string): Promise<void> {
  return null;
}
export async function inviteToWorkspace(
  email: string,
  role: UserRole,
): Promise<Invitation> {
  return null;
}
export async function removeFromWorkspace(userId: string): Promise<void> {
  return null;
}
export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<User> {
  return null;
}
export async function acceptInvitation(
  token: string,
  userData: { full_name: string; password: string },
): Promise<User> {
  return null;
}
