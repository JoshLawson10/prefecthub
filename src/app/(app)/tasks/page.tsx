import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { TasksView } from "@/components/tasks/tasks-view";

export default function TasksPage() {
  return (
    <div>
      <Header title="Tasks" />
      <Separator className="my-4" />
      <TasksView />
    </div>
  );
}
