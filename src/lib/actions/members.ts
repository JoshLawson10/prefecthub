"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function inviteMember(email: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  });
  if (error) throw new Error(error.message);
}

export interface UpdateMemberRoleInput {
  memberId: string;
  newRole: "admin" | "prefect";
}

export async function updateMemberRole(
  input: UpdateMemberRoleInput,
): Promise<void> {
  console.log("[action] updateMemberRole", input);
  // TODO: update profiles.role where id = memberId
}

export async function removeMember(memberId: string): Promise<void> {
  console.log("[action] removeMember", { memberId });
  // TODO: delete from workspace_members where member_id = memberId
}
