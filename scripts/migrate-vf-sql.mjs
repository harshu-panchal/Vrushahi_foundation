// Migrates data from the legacy VF SQL Server database into the MongoDB
// collections used by this app's accounting module.
//
// Usage (from the project root):
//   node --env-file=.env.local scripts/migrate-vf-sql.mjs
//
// Requires:
//   - MONGODB_URI in .env.local (same as the app)
//   - `sqlcmd` on PATH, able to reach the source DB (edit SQL_SERVER/SQL_DATABASE
//     below if yours differs from the local `.\SQLEXPRESS` / `VF` defaults)
//
// Safe to re-run: every write is an upsert keyed on the record's natural
// code, so running this twice does not create duplicates.

import { execFileSync } from "node:child_process";
import mongoose from "mongoose";

import FinancialYear from "../lib/models/FinancialYear.js";
import LookupItem from "../lib/models/LookupItem.js";
import Ledger from "../lib/models/Ledger.js";
import Party from "../lib/models/Party.js";
import Bank from "../lib/models/Bank.js";
import Voucher from "../lib/models/Voucher.js";
import OpeningBalance from "../lib/models/OpeningBalance.js";

const SQL_SERVER = process.env.VF_SQL_SERVER || "lpc:.\\SQLEXPRESS";
const SQL_DATABASE = process.env.VF_SQL_DATABASE || "VF";

function queryJson(sql) {
  const raw = execFileSync(
    "sqlcmd",
    [
      "-S",
      SQL_SERVER,
      "-d",
      SQL_DATABASE,
      "-E",
      "-h",
      "-1",
      "-y",
      "0",
      "-W",
      "-Q",
      `SET NOCOUNT ON; ${sql} FOR JSON PATH, INCLUDE_NULL_VALUES`,
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );
  // sqlcmd hard-wraps long NVARCHAR(MAX) output every 2033 characters by
  // inserting a line break — strip those artificial newlines back out
  // before parsing (the JSON text itself never legitimately contains a
  // raw newline; FOR JSON escapes those as \n within strings).
  const out = raw.replace(/\r?\n/g, "").trim();
  if (!out) return [];
  return JSON.parse(out);
}

function num(v) {
  return v === null || v === undefined || v === "" ? undefined : Number(v);
}
function bool(v) {
  return Boolean(v && v !== 0);
}
function str(v) {
  return v === null || v === undefined ? undefined : String(v).trim() || undefined;
}

async function upsertMany(Model, docs, filterFn, label) {
  let count = 0;
  for (const doc of docs) {
    await Model.findOneAndUpdate(filterFn(doc), doc, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    });
    count++;
  }
  console.log(`  ${label}: ${count} record(s) upserted`);
  return count;
}

async function migrateLookup(category, sql, mapRow) {
  const rows = queryJson(sql);
  const docs = rows.map((r) => ({ category, ...mapRow(r) }));
  return upsertMany(
    LookupItem,
    docs,
    (d) => ({ category: d.category, code: d.code }),
    category
  );
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/migrate-vf-sql.mjs"
    );
  }

  console.log(`Connecting to SQL Server (${SQL_SERVER} / ${SQL_DATABASE})...`);
  // Smoke-test the SQL connection before touching Mongo.
  queryJson("SELECT 1 AS ok");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });

  console.log("\n--- Financial years ---");
  const yearRows = queryJson(
    "SELECT year_id, year_code, start_date, end_date, is_active, factory_code FROM tbl_year_generator"
  );
  const yearIdToCode = new Map();
  for (const r of yearRows) yearIdToCode.set(r.year_id, String(r.year_code));
  await upsertMany(
    FinancialYear,
    yearRows.map((r) => ({
      yearCode: String(r.year_code),
      startDate: r.start_date,
      endDate: r.end_date,
      isActive: bool(r.is_active),
      factoryCode: str(r.factory_code),
    })),
    (d) => ({ yearCode: d.yearCode }),
    "financial years"
  );
  const yearCode = (yearId) => yearIdToCode.get(yearId) || String(yearId ?? "1");

  console.log("\n--- Lookups ---");
  await migrateLookup(
    "accountGroupType",
    "SELECT group_type_code, group_name FROM tbl_AC_group_type",
    (r) => ({ code: r.group_type_code, name: r.group_name })
  );
  await migrateLookup(
    "accountALIE",
    "SELECT ALIE_code, ALIE_name, group_type_code FROM tbl_AC_ALIE",
    (r) => ({ code: r.ALIE_code, name: r.ALIE_name, parentCode: r.group_type_code })
  );
  await migrateLookup(
    "accountGroup",
    "SELECT group_code, group_name FROM tbl_AC_group_master",
    (r) => ({ code: r.group_code, name: r.group_name })
  );
  await migrateLookup(
    "accountSubGroup",
    "SELECT subgroup_code, subgroup_name, group_code FROM tbl_Ac_subgroup_master",
    (r) => ({ code: r.subgroup_code, name: r.subgroup_name, parentCode: r.group_code })
  );
  await migrateLookup(
    "accountSubSubGroup",
    "SELECT sub_sub_group_code, sub_sub_group_name, sub_group_code FROM tbl_AC_sub_subgroup",
    (r) => ({
      code: r.sub_sub_group_code,
      name: r.sub_sub_group_name,
      parentCode: r.sub_group_code,
    })
  );
  await migrateLookup(
    "scheduleGroupType",
    "SELECT ac_schedule_group_type_code, ac_schedule_group_type_name FROM tbl_AC_schedule_group_type",
    (r) => ({ code: r.ac_schedule_group_type_code, name: r.ac_schedule_group_type_name })
  );
  await migrateLookup(
    "division",
    "SELECT div_code, div_name FROM tbl_Ac_division_master",
    (r) => ({ code: r.div_code, name: r.div_name })
  );
  await migrateLookup(
    "costCenter",
    "SELECT cost_center_code, cost_center_name FROM tbl_AC_cost_center",
    (r) => ({ code: r.cost_center_code, name: r.cost_center_name })
  );
  await migrateLookup(
    "course",
    "SELECT course_code, course_name FROM tbl_AC_course",
    (r) => ({ code: r.course_code, name: r.course_name })
  );
  await migrateLookup(
    "farmType",
    "SELECT farm_type_code, farm_type_name FROM tbl_AC_farm_type",
    (r) => ({ code: r.farm_type_code, name: r.farm_type_name })
  );
  await migrateLookup(
    "fixedAssetType",
    "SELECT ac_fixed_asset_type_code, yes_no FROM tbl_AC_fixed_asset_type",
    (r) => ({ code: r.ac_fixed_asset_type_code, name: r.yes_no })
  );
  await migrateLookup(
    "voucherType",
    "SELECT vou_type_code, vou_type_name FROM tbl_AC_voucher_type",
    (r) => ({ code: r.vou_type_code, name: r.vou_type_name })
  );
  await migrateLookup(
    "subVoucherType",
    "SELECT sub_vou_type, sub_vou_name, vou_type FROM tbl_AC_sub_voucher_type",
    (r) => ({ code: r.sub_vou_type, name: r.sub_vou_name, parentCode: r.vou_type })
  );
  await migrateLookup(
    "chequeDdType",
    "SELECT ac_cheque_dd_type, ac_cheque_dd_type_name FROM tbl_AC_cheque_dd_type",
    (r) => ({ code: r.ac_cheque_dd_type, name: r.ac_cheque_dd_type_name })
  );
  await migrateLookup(
    "draweeBank",
    "SELECT bank_code, bank_name FROM tbl_AC_drawee_bank",
    (r) => ({ code: r.bank_code, name: r.bank_name })
  );
  await migrateLookup(
    "partyType",
    "SELECT IND_type_code, Ind_type_name FROM tbl_AC_IND_type",
    (r) => ({ code: r.IND_type_code, name: r.Ind_type_name })
  );
  await migrateLookup(
    "partyTypeResource",
    "SELECT ind_type_resource_code, ind_type_resource_name FROM tbl_AC_IND_type_resource",
    (r) => ({ code: r.ind_type_resource_code, name: r.ind_type_resource_name })
  );

  console.log("\n--- Chart of accounts (ledgers) ---");
  const ledgerRows = queryJson(
    "SELECT AC_ML_code, AC_ML_name, group_code, sub_group, sub_sub_group_code, IND_type, INT_ac_code, INT_rate, AC_code_pl, AC_code_old FROM tbl_AC_ML"
  );
  await upsertMany(
    Ledger,
    ledgerRows.map((r) => ({
      code: r.AC_ML_code,
      name: r.AC_ML_name,
      groupCode: num(r.group_code),
      subGroupCode: num(r.sub_group),
      subSubGroupCode: num(r.sub_sub_group_code),
      partyTypeCode: num(r.IND_type),
      interestLedgerCode: num(r.INT_ac_code),
      interestRate: num(r.INT_rate),
      isProfitLoss: bool(r.AC_code_pl),
      oldCode: str(r.AC_code_old),
    })),
    (d) => ({ code: d.code }),
    "ledgers"
  );

  console.log("\n--- Parties ---");
  const partyRows = queryJson(
    "SELECT IND_code, IND_name, IND_type, address, old_code, multiple_activity FROM tbl_AC_IND_others"
  );
  await upsertMany(
    Party,
    partyRows.map((r) => ({
      code: r.IND_code,
      name: r.IND_name,
      typeCode: num(r.IND_type),
      address: str(r.address),
      oldCode: str(r.old_code),
      hasMultipleActivity: bool(r.multiple_activity),
    })),
    (d) => ({ code: d.code }),
    "parties"
  );

  console.log("\n--- Banks ---");
  const bankRows = queryJson(
    "SELECT bank_code, bank_name, bank_short_name, bank_type_code, bank_address, phone_number, email_address, factory_code FROM tbl_com_bank_master"
  );
  await upsertMany(
    Bank,
    bankRows.map((r) => ({
      code: r.bank_code,
      name: r.bank_name,
      shortName: str(r.bank_short_name),
      bankTypeCode: num(r.bank_type_code),
      address: str(r.bank_address),
      phone: str(r.phone_number),
      email: str(r.email_address),
      factoryCode: str(r.factory_code),
    })),
    (d) => ({ code: d.code }),
    "banks"
  );

  console.log("\n--- Opening balances ---");
  const opBalRows = queryJson("SELECT year_id, ac_code, amount FROM tbl_AC_op_bal");
  const indOpBalRows = queryJson(
    "SELECT year_id, ac_code, IND_code, amount FROM tbl_AC_IND_op_bal"
  );
  await upsertMany(
    OpeningBalance,
    [
      ...opBalRows.map((r) => ({
        yearCode: yearCode(r.year_id),
        scope: "ledger",
        ledgerCode: num(r.ac_code),
        amount: Number(r.amount) || 0,
      })),
      ...indOpBalRows.map((r) => ({
        yearCode: yearCode(r.year_id),
        scope: "party",
        ledgerCode: num(r.ac_code),
        partyCode: num(r.IND_code),
        amount: Number(r.amount) || 0,
      })),
    ],
    (d) => ({
      yearCode: d.yearCode,
      scope: d.scope,
      ledgerCode: d.ledgerCode ?? null,
      partyCode: d.partyCode ?? null,
    }),
    "opening balances"
  );

  console.log("\n--- Vouchers ---");
  const headerRows = queryJson(
    "SELECT year_id, ac_voucher_header_code, vou_date, vou_type, prepared_by_user, pass_by_user, vou_status, cashier_user, narration, from_to, bank_code FROM tbl_AC_voucher_header WHERE vou_date IS NOT NULL"
  );
  const detailRows = queryJson(
    "SELECT ac_voucher_header_code, ac_code, ind_code, cr_amt, dr_amt, remark FROM tbl_AC_voucher_detail"
  );
  const chequeRows = queryJson(
    "SELECT vou_trans_no, type, number, date, drawee_bank, amount FROM tbl_AC_voucher_cheque_dd_detail"
  );

  const detailsByHeader = new Map();
  for (const d of detailRows) {
    const list = detailsByHeader.get(d.ac_voucher_header_code) || [];
    list.push({
      ledgerCode: num(d.ac_code) ?? 0,
      partyCode: num(d.ind_code),
      debit: Number(d.dr_amt) || 0,
      credit: Number(d.cr_amt) || 0,
      remark: str(d.remark),
    });
    detailsByHeader.set(d.ac_voucher_header_code, list);
  }
  const chequesByHeader = new Map();
  for (const c of chequeRows) {
    const list = chequesByHeader.get(c.vou_trans_no) || [];
    list.push({
      typeCode: num(c.type),
      number: str(c.number),
      date: c.date || undefined,
      draweeBankCode: num(c.drawee_bank),
      amount: num(c.amount),
    });
    chequesByHeader.set(c.vou_trans_no, list);
  }

  const voucherDocs = headerRows
    .map((h) => ({
      yearCode: yearCode(h.year_id),
      voucherNumber: h.ac_voucher_header_code,
      voucherTypeCode: num(h.vou_type) ?? 0,
      date: h.vou_date,
      narration: str(h.narration),
      fromTo: str(h.from_to),
      bankCode: num(h.bank_code),
      status: num(h.vou_status) ?? 1,
      preparedBy: str(h.prepared_by_user),
      passedBy: str(h.pass_by_user),
      cashierUser: str(h.cashier_user),
      lines: detailsByHeader.get(h.ac_voucher_header_code) || [],
      chequeDdDetails: chequesByHeader.get(h.ac_voucher_header_code) || [],
    }))
    .filter((v) => v.lines.length > 0);

  await upsertMany(
    Voucher,
    voucherDocs,
    (d) => ({ yearCode: d.yearCode, voucherNumber: d.voucherNumber }),
    "vouchers"
  );

  console.log("\nMigration complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
