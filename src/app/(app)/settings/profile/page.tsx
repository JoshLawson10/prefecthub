import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  return (
    <div>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          <Button className="self-end">Save Changes</Button>
        </CardHeader>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="input-field-fullname">Full name</FieldLabel>
            <Input
              id="input-field-fullname"
              type="text"
              placeholder="Enter your full name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-field-email">Email</FieldLabel>
            <Input
              id="input-field-email"
              type="email"
              placeholder="Enter your email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-field-role">Role</FieldLabel>
            <Input
              id="input-field-role"
              type="text"
              placeholder="Prefect"
              disabled
            />
            <FieldDescription>Only admins can change this</FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
