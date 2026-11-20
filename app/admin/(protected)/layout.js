import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/verifySession";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSettings } from "@/lib/content/read";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getSettings();

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar logoUrl={settings.logoFooterUrl} />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
