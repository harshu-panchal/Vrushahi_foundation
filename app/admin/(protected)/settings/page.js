import { getSettings } from "@/lib/content/read";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Site Settings — Admin" };

export default async function SettingsAdminPage() {
  // Reads through the same merged getter the public site uses, so an
  // unsaved/partial document still shows the values currently on the site
  // rather than empty boxes.
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Site settings</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-soft">
        Organisation identity, registration details, contact information, bank
        details and the donation form&apos;s amounts. These appear across the
        whole public site.
      </p>
      <div className="mt-8">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
