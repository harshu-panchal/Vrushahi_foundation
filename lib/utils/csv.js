function escapeCsvField(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Builds an RFC-4180 CSV string from an array of header keys and row objects.
 * @param {{ key: string, label: string }[]} columns
 * @param {object[]} rows
 */
export function toCsv(columns, rows) {
  const header = columns.map((c) => escapeCsvField(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvField(row[c.key])).join(",")
  );
  return [header, ...lines].join("\r\n");
}
