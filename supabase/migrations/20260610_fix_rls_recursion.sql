-- Migration: fix infinite recursion in RLS policies
-- The previous migration used sub-selects on public.users inside policies on
-- public.users itself, causing infinite recursion. The fix is to expose the
-- current user's workspace_id and role via SECURITY DEFINER functions that
-- run as the table owner (bypassing RLS) and are called from all policies.
--
-- Run this AFTER 20260610_users_rls_policies.sql, or run it standalone if
-- you are applying migrations to a fresh database.
-- ============================================================

-- Drop all existing policies that contain the recursive sub-select pattern
-- (safe to run even if they don't exist yet -- use IF EXISTS)

-- users
DROP POLICY IF EXISTS "users_select_same_workspace"  ON public.users;
DROP POLICY IF EXISTS "users_update_own"              ON public.users;

-- workspaces
DROP POLICY IF EXISTS "workspaces_select_member"  ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_update_admin"   ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_delete_admin"   ON public.workspaces;

-- events
DROP POLICY IF EXISTS "events_select_workspace"  ON public.events;
DROP POLICY IF EXISTS "events_insert_workspace"  ON public.events;
DROP POLICY IF EXISTS "events_update_workspace"  ON public.events;
DROP POLICY IF EXISTS "events_delete_workspace"  ON public.events;

-- event_members
DROP POLICY IF EXISTS "event_members_select_workspace"  ON public.event_members;
DROP POLICY IF EXISTS "event_members_insert_workspace"  ON public.event_members;
DROP POLICY IF EXISTS "event_members_update_workspace"  ON public.event_members;
DROP POLICY IF EXISTS "event_members_delete_workspace"  ON public.event_members;

-- tasks
DROP POLICY IF EXISTS "tasks_select_workspace"  ON public.tasks;
DROP POLICY IF EXISTS "tasks_insert_workspace"  ON public.tasks;
DROP POLICY IF EXISTS "tasks_update_workspace"  ON public.tasks;
DROP POLICY IF EXISTS "tasks_delete_workspace"  ON public.tasks;

-- rsvps
DROP POLICY IF EXISTS "rsvps_select_workspace"  ON public.rsvps;

-- correspondence_logs
DROP POLICY IF EXISTS "correspondence_select_workspace"  ON public.correspondence_logs;
DROP POLICY IF EXISTS "correspondence_insert_workspace"  ON public.correspondence_logs;
DROP POLICY IF EXISTS "correspondence_delete_workspace"  ON public.correspondence_logs;

-- notes
DROP POLICY IF EXISTS "notes_select_workspace"  ON public.notes;
DROP POLICY IF EXISTS "notes_insert_workspace"  ON public.notes;
DROP POLICY IF EXISTS "notes_update_workspace"  ON public.notes;
DROP POLICY IF EXISTS "notes_delete_workspace"  ON public.notes;

-- documents
DROP POLICY IF EXISTS "documents_select_workspace"  ON public.documents;
DROP POLICY IF EXISTS "documents_insert_workspace"  ON public.documents;
DROP POLICY IF EXISTS "documents_delete_workspace"  ON public.documents;

-- notifications
DROP POLICY IF EXISTS "notifications_select_own"   ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own"   ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_own"   ON public.notifications;

-- invitations
DROP POLICY IF EXISTS "invitations_select_workspace"  ON public.invitations;
DROP POLICY IF EXISTS "invitations_select_by_token"   ON public.invitations;
DROP POLICY IF EXISTS "invitations_insert_workspace"  ON public.invitations;
DROP POLICY IF EXISTS "invitations_update_service"    ON public.invitations;

-- ============================================================
-- SECURITY DEFINER helper functions
-- These run as the table owner, bypassing RLS, so they can
-- safely query public.users without causing recursion.
-- ============================================================

CREATE OR REPLACE FUNCTION public.current_user_workspace_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workspace_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- users table policies (non-recursive)
-- ============================================================
CREATE POLICY "users_select_same_workspace"
  ON public.users FOR SELECT
  USING (
    workspace_id = public.current_user_workspace_id()
    OR id = auth.uid()
  );

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- workspaces
-- ============================================================
CREATE POLICY "workspaces_select_member"
  ON public.workspaces FOR SELECT
  USING (id = public.current_user_workspace_id());

CREATE POLICY "workspaces_update_admin"
  ON public.workspaces FOR UPDATE
  USING (
    id = public.current_user_workspace_id()
    AND public.current_user_role() = 'admin'
  );

CREATE POLICY "workspaces_delete_admin"
  ON public.workspaces FOR DELETE
  USING (
    id = public.current_user_workspace_id()
    AND public.current_user_role() = 'admin'
  );

-- ============================================================
-- events
-- ============================================================
CREATE POLICY "events_select_workspace"
  ON public.events FOR SELECT
  USING (workspace_id = public.current_user_workspace_id());

CREATE POLICY "events_insert_workspace"
  ON public.events FOR INSERT
  WITH CHECK (workspace_id = public.current_user_workspace_id());

CREATE POLICY "events_update_workspace"
  ON public.events FOR UPDATE
  USING (workspace_id = public.current_user_workspace_id());

CREATE POLICY "events_delete_workspace"
  ON public.events FOR DELETE
  USING (workspace_id = public.current_user_workspace_id());

-- ============================================================
-- event_members
-- ============================================================
CREATE POLICY "event_members_select_workspace"
  ON public.event_members FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = public.current_user_workspace_id()
    )
  );

CREATE POLICY "event_members_insert_workspace"
  ON public.event_members FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = public.current_user_workspace_id()
    )
  );

CREATE POLICY "event_members_update_workspace"
  ON public.event_members FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = public.current_user_workspace_id()
    )
  );

CREATE POLICY "event_members_delete_workspace"
  ON public.event_members FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = public.current_user_workspace_id()
    )
  );

-- ============================================================
-- tasks
-- ============================================================
CREATE POLICY "tasks_select_workspace"
  ON public.tasks FOR SELECT
  USING (workspace_id = public.current_user_workspace_id());

CREATE POLICY "tasks_insert_workspace"
  ON public.tasks FOR INSERT
  WITH CHECK (workspace_id = public.current_user_workspace_id());

CREATE POLICY "tasks_update_workspace"
  ON public.tasks FOR UPDATE
  USING (workspace_id = public.current_user_workspace_id());

CREATE POLICY "tasks_delete_workspace"
  ON public.tasks FOR DELETE
  USING (workspace_id = public.current_user_workspace_id());

-- ============================================================
-- rsvps
-- ============================================================
CREATE POLICY "rsvps_select_workspace"
  ON public.rsvps FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = public.current_user_workspace_id()
    )
  );

-- ============================================================
-- correspondence_logs
-- ============================================================
CREATE POLICY "correspondence_select_workspace"
  ON public.correspondence_logs FOR SELECT
  USING (workspace_id = public.current_user_workspace_id());

CREATE POLICY "correspondence_insert_workspace"
  ON public.correspondence_logs FOR INSERT
  WITH CHECK (workspace_id = public.current_user_workspace_id());

CREATE POLICY "correspondence_delete_workspace"
  ON public.correspondence_logs FOR DELETE
  USING (workspace_id = public.current_user_workspace_id());

-- ============================================================
-- notes
-- ============================================================
CREATE POLICY "notes_select_workspace"
  ON public.notes FOR SELECT
  USING (workspace_id = public.current_user_workspace_id());

CREATE POLICY "notes_insert_workspace"
  ON public.notes FOR INSERT
  WITH CHECK (workspace_id = public.current_user_workspace_id());

CREATE POLICY "notes_update_workspace"
  ON public.notes FOR UPDATE
  USING (workspace_id = public.current_user_workspace_id());

CREATE POLICY "notes_delete_workspace"
  ON public.notes FOR DELETE
  USING (workspace_id = public.current_user_workspace_id());

-- ============================================================
-- documents
-- ============================================================
CREATE POLICY "documents_select_workspace"
  ON public.documents FOR SELECT
  USING (workspace_id = public.current_user_workspace_id());

CREATE POLICY "documents_insert_workspace"
  ON public.documents FOR INSERT
  WITH CHECK (workspace_id = public.current_user_workspace_id());

CREATE POLICY "documents_delete_workspace"
  ON public.documents FOR DELETE
  USING (workspace_id = public.current_user_workspace_id());

-- ============================================================
-- notifications
-- ============================================================
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- invitations
-- ============================================================
-- Workspace members can list invitations
CREATE POLICY "invitations_select_workspace"
  ON public.invitations FOR SELECT
  USING (workspace_id = public.current_user_workspace_id());

-- Public token lookup needed by the unauthenticated onboard page
CREATE POLICY "invitations_select_by_token"
  ON public.invitations FOR SELECT
  USING (true);

CREATE POLICY "invitations_insert_workspace"
  ON public.invitations FOR INSERT
  WITH CHECK (workspace_id = public.current_user_workspace_id());

-- Service role handles updates (accepting invitations)
CREATE POLICY "invitations_update_service"
  ON public.invitations FOR UPDATE
  USING (true);
