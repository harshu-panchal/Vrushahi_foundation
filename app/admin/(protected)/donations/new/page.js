import DonationForm from "@/components/admin/DonationForm";

export const metadata = { title: "Add Donation — Admin" };

export default function NewDonationPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">
        Record a donation
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Search for an existing donor or enter details for a new one.
      </p>
      <div className="mt-8">
        <DonationForm />
      </div>
    </div>
  );
}
