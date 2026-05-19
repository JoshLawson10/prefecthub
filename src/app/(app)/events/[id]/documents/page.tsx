import { Header } from "@/components/ui/header";
import { DocumentsView } from "@/components/documents/documents-view";
import { getDocumentsByEvent } from "@/lib/data/documents";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const documents = getDocumentsByEvent(id);

  return (
    <div>
      <Header title="Documents" />
      <div className="mt-4">
        <DocumentsView documents={documents} eventId={id} />
      </div>
    </div>
  );
}
