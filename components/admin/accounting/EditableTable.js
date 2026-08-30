"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

function emptyDraft(columns) {
  const draft = {};
  for (const col of columns) draft[col.key] = col.default ?? "";
  return draft;
}

function inputClass() {
  return "w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm text-ink focus:border-terracotta focus:outline-none";
}

function FieldInput({ column, value, onChange }) {
  if (column.type === "select") {
    return (
      <select
        className={inputClass()}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">—</option>
        {column.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  if (column.type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4"
      />
    );
  }
  return (
    <input
      type={column.type === "date" ? "date" : column.type === "number" ? "number" : "text"}
      className={inputClass()}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function displayValue(column, value) {
  if (value === undefined || value === null || value === "") return "—";
  if (column.type === "checkbox") return value ? "Yes" : "No";
  if (column.type === "date") return new Date(value).toLocaleDateString("en-IN");
  if (column.type === "select" && column.options) {
    const match = column.options.find((o) => String(o.value) === String(value));
    return match ? match.label : value;
  }
  return String(value);
}

/**
 * Generic tabular CRUD manager for flat admin-managed records (lookups,
 * chart-of-accounts entries, parties, banks, financial years, opening
 * balances). Rows are add/edit/delete-able inline — no separate
 * new/edit pages needed for these simpler resource types.
 */
export default function EditableTable({ apiBase, columns, initialItems, emptyLabel = "No records yet." }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState(emptyDraft(columns));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function startEdit(item) {
    setEditingId(item._id);
    setDraft({ ...item });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  async function handleCreate() {
    setBusy(true);
    setError("");
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDraft),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Failed to create record");
      return;
    }
    setItems((prev) => [json.item, ...prev]);
    setNewDraft(emptyDraft(columns));
    setAdding(false);
  }

  async function handleUpdate() {
    setBusy(true);
    setError("");
    const res = await fetch(`${apiBase}/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Failed to update record");
      return;
    }
    setItems((prev) => prev.map((it) => (it._id === editingId ? json.item : it)));
    cancelEdit();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    setBusy(true);
    const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      setItems((prev) => prev.filter((it) => it._id !== id));
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-lg bg-terracotta-light px-3 py-2 text-sm text-terracotta-dark">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => {
                    setAdding((v) => !v);
                    setError("");
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-paper hover:bg-terracotta-dark"
                >
                  <Icon name="Plus" className="size-3.5" />
                  Add
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {adding && (
              <tr className="bg-surface/60">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2">
                    <FieldInput
                      column={col}
                      value={newDraft[col.key]}
                      onChange={(v) => setNewDraft((d) => ({ ...d, [col.key]: v }))}
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <button
                    onClick={handleCreate}
                    disabled={busy}
                    className="mr-2 rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-paper disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setAdding(false);
                      setNewDraft(emptyDraft(columns));
                    }}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr key={item._id} className="hover:bg-surface/60">
                {editingId === item._id ? (
                  <>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-2">
                        <FieldInput
                          column={col}
                          value={draft[col.key]}
                          onChange={(v) => setDraft((d) => ({ ...d, [col.key]: v }))}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button
                        onClick={handleUpdate}
                        disabled={busy}
                        className="mr-2 rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-paper disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-ink-soft">
                        {displayValue(col, item[col.key])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => startEdit(item)}
                        className="mr-2 inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink"
                      >
                        <Icon name="Pencil" className="size-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-terracotta-dark hover:bg-terracotta-light"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {items.length === 0 && !adding && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-ink-faint">
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
