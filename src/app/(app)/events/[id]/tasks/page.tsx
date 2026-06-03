import { Header } from "@/components/ui/header";
import { TasksView } from "@/components/tasks/tasks-view";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { getEventTasks } from "@/lib/data/tasks";
import { getWorkspaceMembers } from "@/lib/data/users";

export default async function EventTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tasks, workspaceMembers] = await Promise.all([
    getEventTasks(id),
    getWorkspaceMembers(),
  ]);

  return (
    <div>
      <Header
        title="Tasks"
        actions={
          <CreateTaskDialog eventId={id} workspaceMembers={workspaceMembers} />
        }
      />
      <div className="mt-4">
        <TasksView tasks={tasks} scopedToEvent />
      </div>
    </div>
  );
}
