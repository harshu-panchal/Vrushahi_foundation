"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "@/components/Icon";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "Landmark", exact: true },
  { href: "/admin/donations", label: "Donations", icon: "Heart" },
  { href: "/admin/donors", label: "Donors", icon: "Users" },
  { href: "/admin/volunteers", label: "Volunteers", icon: "HandHeart" },
  { href: "/admin/messages", label: "Messages", icon: "Mail" },
  { href: "/admin/reports", label: "Reports", icon: "CalendarDays" },
];

const accountingNavItems = [
  { href: "/admin/accounting", label: "Overview", icon: "Wallet", exact: true },
  { href: "/admin/accounting/vouchers", label: "Vouchers", icon: "Receipt" },
  { href: "/admin/accounting/ledgers", label: "Chart of Accounts", icon: "BookOpen" },
  { href: "/admin/accounting/parties", label: "Parties", icon: "Users" },
  { href: "/admin/accounting/banks", label: "Banks", icon: "Building2" },
  { href: "/admin/accounting/opening-balances", label: "Opening Balances", icon: "History" },
  { href: "/admin/accounting/financial-years", label: "Financial Years", icon: "CalendarRange" },
  { href: "/admin/accounting/lookups", label: "Lookups", icon: "ListChecks" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-line bg-surface">
      <div className="border-b border-line px-5 py-5">
        <p className="font-display text-lg font-medium text-ink">Vrushahi</p>
        <p className="text-xs uppercase tracking-wide text-ink-faint">
          Admin panel
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-terracotta text-paper"
                  : "text-ink-soft hover:bg-paper"
              )}
            >
              <Icon name={item.icon} className="size-4" />
              {item.label}
            </Link>
          );
        })}

        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Accounting
        </p>
        {accountingNavItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-terracotta text-paper"
                  : "text-ink-soft hover:bg-paper"
              )}
            >
              <Icon name={item.icon} className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper"
        >
          <Icon name="X" className="size-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
