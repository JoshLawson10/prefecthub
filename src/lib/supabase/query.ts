import { createAdminClient } from "@/lib/supabase/admin";

export function createQueryClient() {
  return createAdminClient();
}
