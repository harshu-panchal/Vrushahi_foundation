import Link from "next/link";
import { getFounder } from "@/lib/content/read";
import FounderForm from "@/components/admin/FounderForm";

export const metadata = { title: "Founder — Admin" };

export default async function FounderAdminPage() {
  const founder = await getFounder();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">
        Founder profile
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-soft">
        Drives{" "}
        <Link href="/about/founder" className="underline" target="_blank">
          /about/founder
        </Link>
        .
      </p>
      <p className="mt-4 max-w-2xl rounded-xl border border-marigold bg-marigold-light/40 px-4 py-3 text-sm text-ink-soft">
        The seeded name was read from the Foundation&apos;s registration
        paperwork and was never confirmed, and the biography is deliberately
        role-based because no verified personal history or photograph existed.
        Both are worth checking here first.
      </p>
      <div className="mt-8">
        <FounderForm initial={founder} />
      </div>
    </div>
  );
}
