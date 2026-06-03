import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data/users";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ProfileForm profile={user} />;
}
