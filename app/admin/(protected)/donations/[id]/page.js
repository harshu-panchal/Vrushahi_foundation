import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import DonationForm from "@/components/admin/DonationForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Edit Donation — Admin" };

export default async function EditDonationPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const donationDoc = await Donation.findById(id).populate("donor").lean();
  if (!donationDoc) notFound();
  // Strip Mongoose-specific types (ObjectId, Date) to plain JSON before
  // passing across the server/client component boundary.
  const donation = JSON.parse(JSON.stringify(donationDoc));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          Edit donation
        </h1>
        <DeleteButton
          endpoint={`/api/admin/donations/${id}`}
          confirmText="Delete this donation record? This cannot be undone."
          redirectTo="/admin/donations"
        />
      </div>
      <div className="mt-8">
        <DonationForm donationId={id} initial={donation} />
      </div>
    </div>
  );
}
