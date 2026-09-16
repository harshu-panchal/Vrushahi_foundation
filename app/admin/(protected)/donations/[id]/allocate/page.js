import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import AllocateDonationForm from "@/components/admin/AllocateDonationForm";

export const metadata = { title: "Allocate Donation — Admin" };

export default async function AllocateDonationPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const donationDoc = await Donation.findById(id).populate("donor").lean();
  if (!donationDoc) notFound();
  const donation = JSON.parse(JSON.stringify(donationDoc));

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">
        Assign donation
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        ₹{donation.amount.toLocaleString("en-IN")} from{" "}
        {donation.donor?.name || "an anonymous donor"} — record where and when
        this amount was put to use.
      </p>
      <div className="mt-8">
        <AllocateDonationForm donationId={id} initial={donation.allocation} />
      </div>
    </div>
  );
}
