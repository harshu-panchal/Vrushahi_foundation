import ExcelJS from "exceljs";

/**
 * Builds a downloadable .xlsx Response from column definitions + row objects.
 * @param {{ key: string, label: string, width?: number }[]} columns
 * @param {object[]} rows
 * @param {string} filename
 */
export async function buildXlsxResponse(columns, rows, filename) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");

  sheet.columns = columns.map((c) => ({
    header: c.label,
    key: c.key,
    width: c.width ?? Math.max(12, c.label.length + 2),
  }));
  sheet.getRow(1).font = { bold: true };
  sheet.addRows(rows);

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
