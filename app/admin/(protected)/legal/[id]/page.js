import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import LegalPage from "@/lib/models/LegalPage";
import LegalPageForm from "@/components/admin/LegalPageForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Edit Legal Page — Admin" };

export default async function EditLegalPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const doc = await LegalPage.findById(id).lean();
  if (!doc) notFound();
  const page = JSON.parse(JSON.stringify(doc));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          Edit legal page
        </h1>
        <DeleteButton
          endpoint={`/api/admin/legal-pages/${id}`}
          confirmText={`Delete the ${page.title} page?`}
          redirectTo="/admin/legal"
        />
      </div>
      <div className="mt-8">
        <LegalPageForm pageId={id} initial={page} />
      </div>
    </div>
  );
}
