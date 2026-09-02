import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin Login — Vrushahi Foundation",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8 shadow-lift">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo1.png"
            alt="Vrushahi Foundation"
            width={48}
            height={48}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">
              Vrushahi Foundation
            </p>
            <h1 className="font-display text-lg font-medium text-ink">
              Admin sign in
            </h1>
          </div>
        </div>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
