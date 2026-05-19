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

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
}

const TASK_NOTIFICATIONS: NotifSetting[] = [
  {
    id: "task-overdue",
    label: "Task overdue alerts",
    description: "Get notified when a task assigned to you becomes overdue.",
    defaultOn: true,
  },
  {
    id: "task-assigned",
    label: "New task assigned",
    description: "Receive an email when a task is assigned to you.",
    defaultOn: true,
  },
  {
    id: "task-completed",
    label: "Task completed",
    description: "Notify when someone marks a task you created as done.",
    defaultOn: false,
  },
];

const EVENT_NOTIFICATIONS: NotifSetting[] = [
  {
    id: "rsvp-updates",
    label: "RSVP submissions",
    description: "Notify when someone RSVPs to an event you manage.",
    defaultOn: false,
  },
  {
    id: "event-created",
    label: "New event created",
    description: "Notify when a new event is added to the workspace.",
    defaultOn: true,
  },
  {
    id: "event-updated",
    label: "Event updated",
    description: "Notify when an event you're assigned to is edited.",
    defaultOn: false,
  },
];

const SYSTEM_NOTIFICATIONS: NotifSetting[] = [
  {
    id: "correspondence-logged",
    label: "New correspondence",
    description:
      "Notify when a new log entry is added to an event you're part of.",
    defaultOn: false,
  },
  {
    id: "member-added",
    label: "Member added",
    description: "Notify when a new member joins the workspace.",
    defaultOn: false,
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
  values: Record<string, boolean>;
  onChange: (id: string, val: boolean) => void;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-4 py-3">
        {title}
      </p>
      {settings.map((s, i) => (
        <div key={s.id}>
          {i > 0 && <Separator className="mx-4" />}
          <Field orientation="horizontal" className="px-4 py-3.5">
            <FieldContent>
              <FieldLabel htmlFor={`switch-${s.id}`}>{s.label}</FieldLabel>
              <FieldDescription>{s.description}</FieldDescription>
            </FieldContent>
            <Switch
              id={`switch-${s.id}`}
              checked={values[s.id] ?? s.defaultOn}
              onCheckedChange={(v) => onChange(s.id, v)}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const allSettings = [
    ...TASK_NOTIFICATIONS,
    ...EVENT_NOTIFICATIONS,
    ...SYSTEM_NOTIFICATIONS,
  ];

  const [values, setValues] = useState<Record<string, boolean>>(
    Object.fromEntries(allSettings.map((s) => [s.id, s.defaultOn])),
  );
  const [saved, setSaved] = useState(false);

  function handleChange(id: string, val: boolean) {
    setValues((prev) => ({ ...prev, [id]: val }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            settings={TASK_NOTIFICATIONS}
            values={values}
            onChange={handleChange}
          />
          <NotifGroup
            title="Events"
            settings={EVENT_NOTIFICATIONS}
            values={values}
            onChange={handleChange}
          />
          <NotifGroup
            title="System"
            settings={SYSTEM_NOTIFICATIONS}
            values={values}
            onChange={handleChange}
          />
        </div>

        <CardFooter className="justify-end gap-2 mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setValues(
                Object.fromEntries(allSettings.map((s) => [s.id, s.defaultOn])),
              )
            }
          >
            Reset to defaults
          </Button>
          <Button size="sm" onClick={handleSave}>
            {saved ? (
              <>
                <CheckIcon /> Saved
              </>
            ) : (
              "Save preferences"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
