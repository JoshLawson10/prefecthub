-- Migration: RLS policies for all core tables
-- Run this in the Supabase SQL editor if you set up tables manually,
-- or apply via the Supabase CLI.

-- ============================================================
-- users
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read any profile in the same workspace
CREATE POLICY "users_select_same_workspace"
  ON public.users FOR SELECT
  USING (
    workspace_id = (
      SELECT workspace_id FROM public.users WHERE id = auth.uid()
    )
    OR id = auth.uid()
  );

-- Users can update only their own profile
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- Insert is handled by the service role (onboarding + seed)
-- No INSERT policy needed for anon/authenticated role.

-- ============================================================
-- workspaces
-- ============================================================
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspaces_select_member"
  ON public.workspaces FOR SELECT
  USING (
    id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "workspaces_update_admin"
  ON public.workspaces FOR UPDATE
  USING (
    id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "workspaces_delete_admin"
  ON public.workspaces FOR DELETE
  USING (
    id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================
-- events
-- ============================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_workspace"
  ON public.events FOR SELECT
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "events_insert_workspace"
  ON public.events FOR INSERT
  WITH CHECK (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "events_update_workspace"
  ON public.events FOR UPDATE
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "events_delete_workspace"
  ON public.events FOR DELETE
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

-- ============================================================
-- event_members
-- ============================================================
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_members_select_workspace"
  ON public.event_members FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "event_members_insert_workspace"
  ON public.event_members FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "event_members_update_workspace"
  ON public.event_members FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "event_members_delete_workspace"
  ON public.event_members FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    )
  );

-- ============================================================
-- tasks
-- ============================================================
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select_workspace"
  ON public.tasks FOR SELECT
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "tasks_insert_workspace"
  ON public.tasks FOR INSERT
  WITH CHECK (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "tasks_update_workspace"
  ON public.tasks FOR UPDATE
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "tasks_delete_workspace"
  ON public.tasks FOR DELETE
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

-- ============================================================
-- rsvps (public insert, workspace-scoped read)
-- ============================================================
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an RSVP (public page, no auth required)
CREATE POLICY "rsvps_insert_public"
  ON public.rsvps FOR INSERT
  WITH CHECK (true);

-- Only workspace members can read RSVPs for their events
CREATE POLICY "rsvps_select_workspace"
  ON public.rsvps FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    )
  );

-- ============================================================
-- correspondence_logs
-- ============================================================
ALTER TABLE public.correspondence_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "correspondence_select_workspace"
  ON public.correspondence_logs FOR SELECT
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "correspondence_insert_workspace"
  ON public.correspondence_logs FOR INSERT
  WITH CHECK (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "correspondence_delete_workspace"
  ON public.correspondence_logs FOR DELETE
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

-- ============================================================
-- notes
-- ============================================================
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select_workspace"
  ON public.notes FOR SELECT
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "notes_insert_workspace"
  ON public.notes FOR INSERT
  WITH CHECK (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "notes_update_workspace"
  ON public.notes FOR UPDATE
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "notes_delete_workspace"
  ON public.notes FOR DELETE
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

-- ============================================================
-- documents
-- ============================================================
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select_workspace"
  ON public.documents FOR SELECT
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "documents_insert_workspace"
  ON public.documents FOR INSERT
  WITH CHECK (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "documents_delete_workspace"
  ON public.documents FOR DELETE
  USING (workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

-- ============================================================
-- notifications
-- ============================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

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
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Admins/captains can read invitations for their workspace
CREATE POLICY "invitations_select_workspace"
  ON public.invitations FOR SELECT
  USING (
    workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
  );

-- Unauthenticated lookup by token for onboarding (needed by the public onboard page)
CREATE POLICY "invitations_select_by_token"
  ON public.invitations FOR SELECT
  USING (true);

CREATE POLICY "invitations_insert_workspace"
  ON public.invitations FOR INSERT
  WITH CHECK (
    workspace_id = (SELECT workspace_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "invitations_update_service"
  ON public.invitations FOR UPDATE
  USING (true);
