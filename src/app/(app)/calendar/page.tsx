import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { CalendarView } from "@/components/calendar/calendar-view";

export default async function CalendarPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Calendar" />
      <Separator className="my-4" />
      <div className="flex-1 min-h-0">
        <CalendarView />
      </div>
    </div>
  );
}
