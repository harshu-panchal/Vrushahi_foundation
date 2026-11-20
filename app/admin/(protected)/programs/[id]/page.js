import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import Program from "@/lib/models/Program";
import ProgramForm from "@/components/admin/ProgramForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Edit Programme — Admin" };

export default async function EditProgramPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const doc = await Program.findById(id).lean();
  if (!doc) notFound();
  const program = JSON.parse(JSON.stringify(doc));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          Edit programme
        </h1>
        <DeleteButton
          endpoint={`/api/admin/programs/${id}`}
          confirmText={`Delete the ${program.title} programme?`}
          redirectTo="/admin/programs"
        />
      </div>
      <div className="mt-8">
        <ProgramForm programId={id} initial={program} />
      </div>
    </div>
  );
}
