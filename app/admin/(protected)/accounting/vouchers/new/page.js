import Link from "next/link";
import VoucherForm from "@/components/admin/accounting/VoucherForm";

export const metadata = { title: "New Voucher — Admin" };

export default function NewVoucherPage() {
  return (
    <div>
      <Link
        href="/admin/accounting/vouchers"
        className="text-sm text-ink-faint hover:text-terracotta"
      >
        &larr; All vouchers
      </Link>
      <h1 className="mt-2 font-display text-2xl font-medium text-ink">New Voucher</h1>
      <div className="mt-6 max-w-4xl">
        <VoucherForm />
      </div>
    </div>
  );
}
