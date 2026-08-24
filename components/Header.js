"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { mainNav } from "@/data/nav";
import Container from "./Container";
import Icon from "./Icon";

function NavItem({ item, pathname }) {
  const [open, setOpen] = useState(false);

  if (item.items) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          className="flex items-center gap-1 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
          aria-expanded={open}
        >
          {item.label}
          <Icon name="ChevronDown" className="size-3.5" />
        </button>
        {open && (
          <div className="absolute left-0 top-full min-w-56 rounded-xl border border-line bg-paper py-2 shadow-lift">
            {item.items.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="block px-4 py-2 text-sm text-ink-soft hover:bg-surface hover:text-terracotta"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={clsx(
        "py-2 text-sm font-medium transition-colors hover:text-terracotta",
        active ? "text-terracotta" : "text-ink-soft"
      )}
    >
      {item.label}
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="flex size-10 items-center justify-center rounded-full bg-forest text-paper">
            <Icon name="Heart" className="size-5" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-medium text-ink">Vrushahi</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
              Foundation
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <NavItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark"
          >
            Donate Now
          </Link>
        </div>

        <button
          className="flex size-10 items-center justify-center rounded-full border border-line lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Icon name={mobileOpen ? "X" : "Menu"} className="size-5" />
        </button>
      </Container>

      {mobileOpen && (
        <div className="border-t border-line bg-paper lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) =>
              item.items ? (
                <div key={item.label} className="py-2">
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    {item.label}
                  </p>
                  {item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block rounded-lg px-2 py-2 text-sm text-ink-soft hover:bg-surface"
                      onClick={() => setMobileOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-ink-soft hover:bg-surface"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/donate"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-paper"
              onClick={() => setMobileOpen(false)}
            >
              Donate Now
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
