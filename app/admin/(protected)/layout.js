import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/verifySession";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
