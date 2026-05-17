import { Header } from "@/components/ui/header";
import { DocumentsView } from "@/components/documents/documents-view";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Header title="Documents" />
      <div className="mt-4">
        <DocumentsView eventId={id} />
      </div>
    </div>
  );
}
