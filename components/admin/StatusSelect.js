"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function StatusSelect({ id, endpoint, status, options }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleChange(e) {
    const next = e.target.value;
    setCurrent(next);
    await fetch(`${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-semibold capitalize focus:border-terracotta focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
