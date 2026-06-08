-- Migration: user_notification_preferences
-- Stores per-user notification toggle settings.
-- Each column maps 1:1 to a notification type in the app.
-- Defaults mirror the hardcoded defaults in the old notifications page.

CREATE TABLE public.user_notification_preferences (
  user_id               uuid        NOT NULL,
  -- Task notifications
  task_overdue          boolean     NOT NULL DEFAULT true,
  task_assigned         boolean     NOT NULL DEFAULT true,
  task_completed        boolean     NOT NULL DEFAULT false,
  -- Event notifications
  rsvp_updates          boolean     NOT NULL DEFAULT false,
  event_created         boolean     NOT NULL DEFAULT true,
  event_updated         boolean     NOT NULL DEFAULT false,
  -- System notifications
  correspondence_logged boolean     NOT NULL DEFAULT false,
  member_added          boolean     NOT NULL DEFAULT false,
  -- Timestamps
  updated_at            timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT user_notification_preferences_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_notification_preferences_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);

-- Row-level security: users can only read/write their own row
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON public.user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON public.user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON public.user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);
