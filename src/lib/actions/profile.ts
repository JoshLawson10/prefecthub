"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface UpdateProfileInput {
  memberId: string;
  fullName: string;
  email: string;
}

export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName,
      email: input.email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.memberId);
  if (error) throw new Error(error.message);
}

export interface UploadAvatarInput {
  memberId: string;
  file: File;
}

export async function uploadAvatar(input: UploadAvatarInput): Promise<void> {
  const supabase = await createClient();
  const buffer   = await input.file.arrayBuffer();
  const fileName = `${input.memberId}-${Date.now()}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, buffer, { contentType: input.file.type, upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() })
    .eq("id", input.memberId);
  if (updateError) throw new Error(updateError.message);
}

export async function deleteAccount(memberId: string): Promise<void> {
  const supabase = createAdminClient();

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", memberId);
  if (profileError) throw new Error(profileError.message);

  const { error: userError } = await supabase.auth.admin.deleteUser(memberId);
  if (userError) throw new Error(userError.message);
}

export interface CompleteOnboardingInput {
  firstName: string;
  lastName: string;
  password: string;
}

export async function completeOnboarding(input: CompleteOnboardingInput): Promise<void> {
  const supabase  = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("No authenticated user found");

  const fullName = `${input.firstName} ${input.lastName}`.trim();
  const initials = `${input.firstName[0] ?? ""}${input.lastName[0] ?? ""}`.toUpperCase().slice(0, 2);

  const { error: passwordError } = await supabase.auth.updateUser({ password: input.password });
  if (passwordError) throw new Error(passwordError.message);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName, initials, updated_at: new Date().toISOString() })
    .eq("id", authData.user.id);
  if (profileError) throw new Error(profileError.message);
}
