import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import Trustee from "@/lib/models/Trustee";
import TrusteeForm from "@/components/admin/TrusteeForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Edit Trustee — Admin" };

export default async function EditTrusteePage({ params }) {
  const { id } = await params;
  await dbConnect();

  const trusteeDoc = await Trustee.findById(id).lean();
  if (!trusteeDoc) notFound();
  const trustee = JSON.parse(JSON.stringify(trusteeDoc));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          Edit trustee
        </h1>
        <DeleteButton
          endpoint={`/api/admin/trustees/${id}`}
          confirmText={`Remove ${trustee.name} from the Trustees page?`}
          redirectTo="/admin/trustees"
        />
      </div>
      <div className="mt-8">
        <TrusteeForm trusteeId={id} initial={trustee} />
      </div>
    </div>
  );
}
