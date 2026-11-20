import ProgramForm from "@/components/admin/ProgramForm";

export const metadata = { title: "Add Programme — Admin" };

export default function NewProgramPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Add programme</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Appears on the public site once saved and marked visible.
      </p>
      <div className="mt-8">
        <ProgramForm />
      </div>
    </div>
  );
}
