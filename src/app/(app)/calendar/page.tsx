import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { CalendarView } from "@/components/calendar/calendar-view";
import { getCalendarItems } from "@/lib/data/calendar";

export default async function CalendarPage() {
  const items = await getCalendarItems();

  return (
    <div className="flex flex-col h-full">
      <Header title="Calendar" />
      <Separator className="my-4" />
      <div className="flex-1 min-h-0">
        <CalendarView items={items} />
      </div>
    </div>
  );
}
