import { createClient } from "@/lib/supabase/client";

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    name: profile?.full_name ?? user.email ?? "",
    initials: profile?.initials ?? "",
    avatar: profile?.avatar_url ?? "",
    role: profile?.role ?? "N/A",
  };
}
