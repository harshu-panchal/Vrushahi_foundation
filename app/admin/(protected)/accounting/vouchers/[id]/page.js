import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import Voucher from "@/lib/models/Voucher";
import VoucherForm from "@/components/admin/accounting/VoucherForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Voucher — Admin" };

export default async function VoucherDetailPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const doc = await Voucher.findById(id).lean();
  if (!doc) notFound();
  const voucher = JSON.parse(JSON.stringify(doc));

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/admin/accounting/vouchers"
          className="text-sm text-ink-faint hover:text-terracotta"
        >
          &larr; All vouchers
        </Link>
        <DeleteButton
          endpoint={`/api/admin/accounting/vouchers/${id}`}
          confirmText="Delete this voucher? This cannot be undone."
          redirectTo="/admin/accounting/vouchers"
        />
      </div>
      <h1 className="mt-2 font-display text-2xl font-medium text-ink">
        Voucher #{voucher.voucherNumber} — {voucher.yearCode}
      </h1>
      <div className="mt-6 max-w-4xl">
        <VoucherForm voucherId={id} initial={voucher} />
      </div>
    </div>
  );
}
