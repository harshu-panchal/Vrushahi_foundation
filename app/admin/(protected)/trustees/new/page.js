import TrusteeForm from "@/components/admin/TrusteeForm";

export const metadata = { title: "Add Trustee — Admin" };

export default function NewTrusteePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Add trustee</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Appears on the public Trustees page once saved.
      </p>
      <div className="mt-8">
        <TrusteeForm />
      </div>
    </div>
  );
}
