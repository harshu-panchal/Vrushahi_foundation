import { getSettings, getPrograms, getLegalPages } from "@/lib/content/read";

export default async function sitemap() {
  const [settings, programs, legalPages] = await Promise.all([
    getSettings(),
    getPrograms(),
    getLegalPages(),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/about/founder",
    "/about/trustees",
    "/programs",
    "/events",
    "/gallery",
    "/stories",
    "/volunteer",
    "/donate",
    "/contact",
  ];

  const programRoutes = programs.map((p) => `/programs/${p.slug}`);
  const legalRoutes = legalPages.map((p) => `/legal/${p.slug}`);

  return [...staticRoutes, ...programRoutes, ...legalRoutes].map((path) => ({
    url: `${settings.url}${path}`,
    lastModified: new Date(),
  }));
}
