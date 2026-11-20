import Link from "next/link";
import Image from "next/image";
import { footerLinks } from "@/data/nav";
import Container from "./Container";
import Icon from "./Icon";

export default function Footer({ settings, programs = [], legalLinks = [] }) {
  const phones = settings?.contact?.phones || [];
  const phonesRaw = settings?.contact?.phonesRaw || [];
  const name = settings?.name || "Vrushahi Foundation";

  return (
    <footer className="border-t border-line bg-forest text-forest-light">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src={settings?.logoFooterUrl || "/images/logo2.png"}
              alt={name}
              width={144}
              height={144}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          {settings?.tagline && (
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-forest-light/80">
              {settings.tagline}
            </p>
          )}
          {settings?.registration?.act && (
            <p className="mt-6 text-xs uppercase tracking-[0.14em] text-forest-light/60">
              Registered under {settings.registration.act}
            </p>
          )}
          {(settings?.registration?.number || settings?.registration?.pan) && (
            <p className="mt-1 text-xs text-forest-light/60">
              {settings.registration.number &&
                `Reg. No. ${settings.registration.number}`}
              {settings.registration.number && settings.registration.pan && " · "}
              {settings.registration.pan && `PAN ${settings.registration.pan}`}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-paper">Programs</p>
          <ul className="mt-4 space-y-2.5">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/programs/${p.slug}`}
                  className="link-underline text-sm text-forest-light/80 transition-colors hover:text-paper"
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
                  className="link-underline text-sm text-forest-light/80 transition-colors hover:text-paper"
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
            {settings?.location?.line && (
              <li className="flex items-start gap-2">
                <Icon name="MapPin" className="mt-0.5 size-4 shrink-0" />
                <span>{settings.location.line}</span>
              </li>
            )}
            {phones.map((phone, i) => (
              <li key={phone} className="flex items-center gap-2">
                <Icon name="Phone" className="size-4 shrink-0" />
                <a
                  href={`tel:${phonesRaw[i] || phone}`}
                  className="link-underline transition-colors hover:text-paper"
                >
                  {phone}
                </a>
              </li>
            ))}
            {settings?.contact?.email && (
              <li className="flex items-center gap-2">
                <Icon name="Mail" className="size-4 shrink-0" />
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="link-underline transition-colors hover:text-paper"
                >
                  {settings.contact.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-forest-dark/60">
        <Container className="flex flex-col gap-4 py-6 text-xs text-forest-light/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="link-underline transition-colors hover:text-paper"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
