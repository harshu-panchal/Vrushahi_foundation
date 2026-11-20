import { getSettings } from "@/lib/content/read";

export default async function robots() {
  const settings = await getSettings();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${settings.url}/sitemap.xml`,
  };
}
