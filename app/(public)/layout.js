import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMainNav } from "@/data/nav";
import { getPrograms, getLegalPages, getSettings } from "@/lib/content/read";

export default async function PublicLayout({ children }) {
  // The header and footer are client components, so the admin-managed
  // content they need is read here and passed down as props.
  const [settings, programs, legalPages] = await Promise.all([
    getSettings(),
    getPrograms(),
    getLegalPages(),
  ]);

  const nav = buildMainNav(programs);
  const legalLinks = legalPages.map((p) => ({
    href: `/legal/${p.slug}`,
    label: p.title,
  }));

  return (
    <>
      <Header nav={nav} settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer
        settings={settings}
        programs={programs}
        legalLinks={legalLinks}
      />
    </>
  );
}
