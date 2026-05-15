import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";

export default async function MembersPage() {
  return (
    <div>
      <Header
        title="Members"
        actions={
          <>
            <Button>
              <UserPlusIcon /> Invite member
            </Button>
          </>
        }
      />
      <Separator className="my-4" />
    </div>
  );
}
