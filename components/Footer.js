import Link from "next/link";
import { site } from "@/data/site";
import { footerLinks, legalLinks } from "@/data/nav";
import { programs } from "@/data/programs";
import Container from "./Container";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-forest text-forest-light">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-paper text-forest">
              <Icon name="Heart" className="size-5" strokeWidth={2} />
            </span>
            <span className="font-display text-lg font-medium text-paper">
              Vrushahi Foundation
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-forest-light/80">
            {site.tagline}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.14em] text-forest-light/60">
            Registered under {site.registration.act}
          </p>
          <p className="mt-1 text-xs text-forest-light/60">
            Reg. No. {site.registration.number} · PAN {site.registration.pan}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-paper">Programs</p>
          <ul className="mt-4 space-y-2.5">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/programs/${p.slug}`}
                  className="text-sm text-forest-light/80 transition-colors hover:text-paper"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-paper">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-forest-light/80 transition-colors hover:text-paper"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-paper">Get in touch</p>
          <ul className="mt-4 space-y-3 text-sm text-forest-light/80">
            <li className="flex items-start gap-2">
              <Icon name="MapPin" className="mt-0.5 size-4 shrink-0" />
              <span>{site.location.line}</span>
            </li>
            {site.contact.phones.map((phone, i) => (
              <li key={phone} className="flex items-center gap-2">
                <Icon name="Phone" className="size-4 shrink-0" />
                <a href={`tel:${site.contact.phonesRaw[i]}`} className="hover:text-paper">
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Icon name="Mail" className="size-4 shrink-0" />
              <a href={`mailto:${site.contact.email}`} className="hover:text-paper">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-forest-dark/60">
        <Container className="flex flex-col gap-4 py-6 text-xs text-forest-light/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Vrushahi Foundation. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-paper">
                {l.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
