import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import FinancialYear from "@/lib/models/FinancialYear";
import Ledger from "@/lib/models/Ledger";
import Party from "@/lib/models/Party";
import Bank from "@/lib/models/Bank";
import Voucher from "@/lib/models/Voucher";
import OpeningBalance from "@/lib/models/OpeningBalance";
import LookupItem from "@/lib/models/LookupItem";
import StatCard from "@/components/admin/StatCard";

export const metadata = { title: "Accounting — Admin" };

const sections = [
  { href: "/admin/accounting/vouchers", label: "Vouchers", desc: "Cash, bank and journal entries" },
  { href: "/admin/accounting/ledgers", label: "Chart of Accounts", desc: "Ledger codes vouchers post to" },
  { href: "/admin/accounting/parties", label: "Parties", desc: "Farmers, traders, suppliers" },
  { href: "/admin/accounting/banks", label: "Banks", desc: "Bank master data" },
  { href: "/admin/accounting/opening-balances", label: "Opening Balances", desc: "Carried-over balances" },
  { href: "/admin/accounting/financial-years", label: "Financial Years", desc: "Accounting year periods" },
  { href: "/admin/accounting/lookups", label: "Lookups", desc: "Voucher types, divisions, cost centers…" },
];

export default async function AccountingOverviewPage() {
  await dbConnect();
  const [years, ledgers, parties, banks, vouchers, openingBalances, lookups] =
    await Promise.all([
      FinancialYear.countDocuments(),
      Ledger.countDocuments(),
      Party.countDocuments(),
      Bank.countDocuments(),
      Voucher.countDocuments(),
      OpeningBalance.countDocuments(),
      LookupItem.countDocuments(),
    ]);

  const counts = {
    "/admin/accounting/vouchers": vouchers,
    "/admin/accounting/ledgers": ledgers,
    "/admin/accounting/parties": parties,
    "/admin/accounting/banks": banks,
    "/admin/accounting/opening-balances": openingBalances,
    "/admin/accounting/financial-years": years,
    "/admin/accounting/lookups": lookups,
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Accounting</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Chart of accounts, vouchers and party ledgers migrated from the legacy
        SQL Server system.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Vouchers" value={vouchers} />
        <StatCard label="Ledgers" value={ledgers} />
        <StatCard label="Parties" value={parties} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-terracotta"
          >
            <p className="font-display text-lg font-medium text-ink">{s.label}</p>
            <p className="mt-1 text-sm text-ink-soft">{s.desc}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {counts[s.href]} record{counts[s.href] === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
