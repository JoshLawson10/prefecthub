import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export default async function NotificationPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardFooter className="flex flex-col py-0">
          <Field orientation="horizontal" className="py-4">
            <FieldContent>
              <FieldLabel htmlFor="switch-focus-mode">
                Task overdue alerts
              </FieldLabel>
              <FieldDescription>
                Notify when your tasks become overdue
              </FieldDescription>
            </FieldContent>
            <Switch id="switch-focus-mode" />
          </Field>
          <Separator />
          <Field orientation="horizontal" className="py-4">
            <FieldContent>
              <FieldLabel htmlFor="switch-focus-mode">
                New task assigned
              </FieldLabel>
              <FieldDescription>
                Email when a task is assigned to you
              </FieldDescription>
            </FieldContent>
            <Switch id="switch-focus-mode" />
          </Field>
          <Separator />
          <Field orientation="horizontal" className="py-4">
            <FieldContent>
              <FieldLabel htmlFor="switch-focus-mode">RSVP updates</FieldLabel>
              <FieldDescription>
                Notify on new RSVP submissions
              </FieldDescription>
            </FieldContent>
            <Switch id="switch-focus-mode" />
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
