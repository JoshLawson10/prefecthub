import { Header } from "@/components/ui/header";
import { TasksView } from "@/components/tasks/tasks-view";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { getTasksByEvent } from "@/lib/data/tasks";

export default async function EventTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tasks = getTasksByEvent(id);

  return (
    <div>
      <Header title="Tasks" actions={<CreateTaskDialog eventId={id} />} />
      <div className="mt-4">
        <TasksView tasks={tasks} scopedToEvent />
      </div>
    </div>
  );
}
