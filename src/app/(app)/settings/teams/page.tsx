import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getWorkspaceMembers,
  getMembersByRole,
} from "@/lib/data/users";
import { getCurrentWorkspace } from "@/lib/data/workspaces";
import { TeamsClient } from "@/components/settings/teams-client";

export default async function TeamsPage() {
  const [user, members, membersByRole, workspace] = await Promise.all([
    getCurrentUser(),
    getWorkspaceMembers(),
    getMembersByRole(),
    getCurrentWorkspace(),
  ]);

  if (!user) redirect("/login");

  return (
    <TeamsClient
      currentUser={user}
      members={members}
      membersByRole={membersByRole}
      workspace={workspace}
    />
  );
}
