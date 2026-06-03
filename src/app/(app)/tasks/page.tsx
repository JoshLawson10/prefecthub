import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { TasksView } from "@/components/tasks/tasks-view";
import { getTasks } from "@/lib/data/tasks";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div>
      <Header title="Tasks" />
      <Separator className="my-4" />
      <TasksView tasks={tasks} />
    </div>
  );
}
