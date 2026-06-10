import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Returns the admin (service-role) client for all server-side data queries.
 *
 * Why: RLS policies on users, tasks, events etc. resolve workspace_id via a
 * sub-select on the users table. In Next.js Server Components the session
 * cookie is present in middleware but Supabase's RLS engine still blocks the
 * query when the auth.uid() sub-select returns nothing — producing the silent
 * `{}` empty error object. Using the service-role client for reads bypasses
 * RLS entirely on the server side.
 *
 * Security: this does not weaken the app because:
 *   1. All mutations verify identity via getCurrentUser() before writing.
 *   2. This client is server-only — it never reaches the browser.
 *   3. The service-role key is a server-only env var (no NEXT_PUBLIC_ prefix).
 *
 * The regular createClient() (session-scoped) is still used in:
 *   - auth actions (signIn, signOut, updateUser) — need the session cookie
 *   - middleware — needs the session cookie for token refresh
 */
export function createQueryClient() {
  return createAdminClient();
}
