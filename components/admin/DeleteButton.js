"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ endpoint, confirmText, redirectTo, label = "Delete" }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (confirmText && !window.confirm(confirmText)) return;
    setDeleting(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    if (res.ok) {
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } else {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-terracotta-dark transition-colors hover:bg-terracotta-light disabled:opacity-60"
    >
      {deleting ? "Deleting…" : label}
    </button>
  );
}
