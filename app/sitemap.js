import { site } from "@/data/site";
import { programs } from "@/data/programs";
import { legalPages } from "@/data/legal";

export default function sitemap() {
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
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
