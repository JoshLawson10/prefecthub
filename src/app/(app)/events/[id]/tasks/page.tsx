import { Header } from "@/components/ui/header";
import { TasksView } from "@/components/tasks/tasks-view";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";

// Mock tasks scoped to this event — replace with Supabase fetch
export default async function EventTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <Header
        title="Tasks"
        actions={<CreateTaskDialog />}
      />
      {/* TasksView accepts an optional eventId to scope its mock data */}
      <div className="mt-4">
        <TasksView eventId={id} />
      </div>
    </div>
  );
}
