import { Suspense } from "react";
import { OnboardForm } from "@/components/auth/onboard-form";

export default function OnboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            Verifying your invitation...
          </p>
        </div>
      }
    >
      <OnboardForm />
    </Suspense>
  );
}
