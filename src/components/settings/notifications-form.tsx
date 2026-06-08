"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { saveNotificationPreferences } from "@/lib/actions/notificationPreferences";
import {
  DefaultNotificationPreferences,
  type UserNotificationPreferences,
} from "@/lib/schemas";

type Prefs = Omit<UserNotificationPreferences, "user_id" | "updated_at">;

interface NotifSetting {
  key: keyof Prefs;
  label: string;
  description: string;
}

const TASK_SETTINGS: NotifSetting[] = [
  {
    key: "task_overdue",
    label: "Task overdue alerts",
    description: "Get notified when a task assigned to you becomes overdue.",
  },
  {
    key: "task_assigned",
    label: "New task assigned",
    description: "Receive a notification when a task is assigned to you.",
  },
  {
    key: "task_completed",
    label: "Task completed",
    description: "Notify when someone marks a task you created as done.",
  },
];

const EVENT_SETTINGS: NotifSetting[] = [
  {
    key: "rsvp_updates",
    label: "RSVP submissions",
    description: "Notify when someone RSVPs to an event you manage.",
  },
  {
    key: "event_created",
    label: "New event created",
    description: "Notify when a new event is added to the workspace.",
  },
  {
    key: "event_updated",
    label: "Event updated",
    description: "Notify when an event you're assigned to is edited.",
  },
];

const SYSTEM_SETTINGS: NotifSetting[] = [
  {
    key: "correspondence_logged",
    label: "New correspondence",
    description:
      "Notify when a new log entry is added to an event you're part of.",
  },
  {
    key: "member_added",
    label: "Member added",
    description: "Notify when a new member joins the workspace.",
  },
];

function NotifGroup({
  title,
  settings,
  values,
  onChange,
}: {
  title: string;
  settings: NotifSetting[];
  values: Prefs;
  onChange: (key: keyof Prefs, val: boolean) => void;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-4 py-3">
        {title}
      </p>
      {settings.map((s, i) => (
        <div key={s.key}>
          {i > 0 && <Separator className="mx-4" />}
          <Field orientation="horizontal" className="px-4 py-3.5">
            <FieldContent>
              <FieldLabel htmlFor={`switch-${s.key}`}>{s.label}</FieldLabel>
              <FieldDescription>{s.description}</FieldDescription>
            </FieldContent>
            <Switch
              id={`switch-${s.key}`}
              checked={values[s.key]}
              onCheckedChange={(v) => onChange(s.key, v)}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

export function NotificationsForm({
  initialPreferences,
}: {
  initialPreferences: Prefs;
}) {
  const [values, setValues] = useState<Prefs>(initialPreferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(key: keyof Prefs, val: boolean) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await saveNotificationPreferences(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save preferences",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setValues(DefaultNotificationPreferences);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="py-0 overflow-hidden">
        <CardHeader className="px-4 pt-4 pb-0">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose what you want to be notified about.
          </CardDescription>
        </CardHeader>

        <div className="flex flex-col divide-y divide-border">
          <NotifGroup
            title="Tasks"
            settings={TASK_SETTINGS}
            values={values}
            onChange={handleChange}
          />
          <NotifGroup
            title="Events"
            settings={EVENT_SETTINGS}
            values={values}
            onChange={handleChange}
          />
          <NotifGroup
            title="System"
            settings={SYSTEM_SETTINGS}
            values={values}
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-sm text-destructive px-4 pb-2">{error}</p>}

        <CardFooter className="justify-end gap-2 mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={saving}
          >
            Reset to defaults
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saved ? (
              <>
                <CheckIcon /> Saved
              </>
            ) : saving ? (
              "Saving..."
            ) : (
              "Save preferences"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
