// Imports the website content that used to be hardcoded in `data/*.js` into
// MongoDB, so it can be edited from the admin panel without losing anything.
//
// Usage (from the project root):
//   node --env-file=.env scripts/seed-content.mjs            # dry run
//   node --env-file=.env scripts/seed-content.mjs --write    # apply
//
// Dry run by default on purpose: it prints the database name and every
// document it would write, so you can confirm it is pointed at the right
// cluster before anything changes.
//
// Safe to re-run. Every write is an upsert keyed on a natural identifier
// (settings key, programme/legal slug, category + order, page name), so
// running it twice does not create duplicates. By default it does NOT
// overwrite documents that already exist — pass --force to also refresh
// those back to the original seed values, which discards admin edits.

import mongoose from "mongoose";

import Setting, { SETTING_KEY } from "../lib/models/Setting.js";
import Program from "../lib/models/Program.js";
import LegalPage from "../lib/models/LegalPage.js";
import ContentItem from "../lib/models/ContentItem.js";
import PageContent from "../lib/models/PageContent.js";
import FounderProfile, { FOUNDER_KEY } from "../lib/models/FounderProfile.js";

import { site } from "../data/site.js";
import { programs } from "../data/programs.js";
import { legalPages } from "../data/legal.js";
import { contentSeed } from "../data/content.js";
import { pageContentSeed } from "../data/pageContent.js";
import { founderSeed } from "../data/founder.js";

const WRITE = process.argv.includes("--write");
const FORCE = process.argv.includes("--force");

const stats = { created: 0, updated: 0, skipped: 0 };

function log(action, label) {
  const mark = { create: "+", update: "~", skip: "=" }[action];
  console.log(`  ${mark} ${label}`);
  stats[action === "create" ? "created" : action === "update" ? "updated" : "skipped"]++;
}

/**
 * Upserts one document. Existing documents are left alone unless --force,
 * so re-running the script after the Foundation has edited its content does
 * not quietly revert their work.
 */
async function upsert(Model, filter, doc, label) {
  const existing = await Model.findOne(filter).lean();

  if (existing && !FORCE) {
    log("skip", `${label} (already present)`);
    return;
  }

  if (WRITE) {
    await Model.findOneAndUpdate(
      filter,
      { $set: { ...doc, ...filter } },
      { upsert: true, returnDocument: "after", runValidators: true }
    );
  }
  log(existing ? "update" : "create", label);
}

/** Fills {{registration.act}}-style references from the seed settings. */
function fill(text) {
  return String(text || "").replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
    const value = path.split(".").reduce((acc, k) => acc?.[k], site);
    return value == null ? match : String(value);
  });
}

async function seedSettings() {
  console.log("\nSite settings");
  await upsert(Setting, { key: SETTING_KEY }, site, "site settings");
}

async function seedPrograms() {
  console.log("\nProgrammes");
  for (const [index, p] of programs.entries()) {
    await upsert(
      Program,
      { slug: p.slug },
      {
        title: p.title,
        short: p.short,
        icon: p.icon,
        statValue: p.stat?.value,
        statLabel: p.stat?.label,
        image: p.image,
        imageAlt: p.imageAlt,
        sections: p.sections,
        order: index,
        isActive: true,
      },
      `${p.title} (${p.sections.length} sections)`
    );
  }
}

async function seedLegal() {
  console.log("\nLegal pages");
  for (const [index, p] of legalPages.entries()) {
    await upsert(
      LegalPage,
      { slug: p.slug },
      {
        title: p.title,
        updated: p.updated,
        sections: p.body,
        order: index,
        isActive: true,
      },
      `${p.title} (${p.body.length} sections)`
    );
  }
}

async function seedContentItems() {
  console.log("\nContent lists");
  for (const [category, items] of Object.entries(contentSeed)) {
    console.log(`  ${category}`);
    for (const [index, item] of items.entries()) {
      // (category, order) is the natural key: the seed order is fixed, so
      // re-running maps each row back onto the same document.
      await upsert(
        ContentItem,
        { category, order: index },
        {
          group: item.group,
          label: item.label,
          title: item.title,
          body: fill(item.body),
          icon: item.icon,
          image: item.image,
          imageAlt: item.imageAlt,
          flag: Boolean(item.flag),
          isActive: true,
        },
        // Mission points and objectives carry only a body, so fall back to
        // a snippet of it rather than logging a dozen identical "item" lines.
        `  ${
          item.title ||
          item.label ||
          item.group ||
          item.image ||
          `${String(item.body).slice(0, 60)}…`
        }`
      );
    }
  }
}

async function seedPageContent() {
  console.log("\nPage copy");
  for (const [page, blocks] of Object.entries(pageContentSeed)) {
    await upsert(
      PageContent,
      { page },
      // Stored verbatim: {{program}} in the programme CTA is filled in at
      // render time, not here.
      { blocks },
      `${page} (${blocks.length} blocks)`
    );
  }
}

async function seedFounder() {
  console.log("\nFounder profile");
  await upsert(FounderProfile, { key: FOUNDER_KEY }, founderSeed, founderSeed.name);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Run with: node --env-file=.env scripts/seed-content.mjs");
    process.exit(1);
  }

  await mongoose.connect(uri, { bufferCommands: false });
  const { name, host } = mongoose.connection;

  console.log(`${WRITE ? "WRITING TO" : "DRY RUN against"} database "${name}" on ${host}`);
  if (FORCE) {
    console.log("--force: existing documents will be reset to the seed values.");
  }

  await seedSettings();
  await seedPrograms();
  await seedLegal();
  await seedContentItems();
  await seedPageContent();
  await seedFounder();

  console.log(
    `\n${stats.created} to create, ${stats.updated} to update, ${stats.skipped} already present.`
  );
  if (!WRITE) {
    console.log("Nothing was written. Re-run with --write to apply.");
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
