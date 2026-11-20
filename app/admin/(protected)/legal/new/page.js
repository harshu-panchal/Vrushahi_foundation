import LegalPageForm from "@/components/admin/LegalPageForm";

export const metadata = { title: "Add Legal Page — Admin" };

export default function NewLegalPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">
        Add legal page
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Linked from the site footer once published.
      </p>
      <div className="mt-8">
        <LegalPageForm />
      </div>
    </div>
  );
}
