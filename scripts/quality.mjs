#!/usr/bin/env node
// Data-quality sweep — complements validate.mjs (which checks shape).
// This script checks *relationships* between records:
//   1. ID uniqueness across all datasets
//   2. Cross-reference resolution (buildComponents / recipes.ingredients /
//      production.producesIds / ammunition.usedBy)
//   3. Orphan report: items with no usedIn/producer (warning, not error)

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const load = (p) => JSON.parse(readFileSync(resolve(repoRoot, p), "utf8"));
const index = load("index.json");

// Build a global registry of every id → {path, record}
const registry = new Map();
const duplicates = [];
for (const ds of index.datasets) {
  const data = load(ds.path);
  for (const rec of data.resources) {
    if (registry.has(rec.id)) {
      duplicates.push({
        id: rec.id,
        first: registry.get(rec.id).path,
        second: ds.path,
      });
    } else {
      registry.set(rec.id, { path: ds.path, record: rec });
    }
  }
}

let errors = 0;
let warnings = 0;

// 1. Uniqueness
if (duplicates.length > 0) {
  console.error("✗ Duplicate IDs found:");
  for (const d of duplicates) {
    console.error(`    ${d.id} — in ${d.first} and ${d.second}`);
    errors++;
  }
} else {
  console.log(`✓ All ${registry.size} IDs are unique across the repo`);
}

// 2. Cross-reference resolution
const unresolved = [];
const checkId = (id, where) => {
  if (!registry.has(id)) unresolved.push({ id, where });
};

for (const { path, record: rec } of registry.values()) {
  // buildComponents
  if (Array.isArray(rec.buildComponents)) {
    for (const c of rec.buildComponents) {
      checkId(c.id, `${path}#${rec.id}.buildComponents`);
    }
  }
  // recipes.ingredients
  if (Array.isArray(rec.recipes)) {
    for (const [ri, r] of rec.recipes.entries()) {
      if (Array.isArray(r.ingredients)) {
        for (const ing of r.ingredients) {
          checkId(ing.id, `${path}#${rec.id}.recipes[${ri}].ingredients`);
        }
      }
    }
  }
  // production.producesIds (on crafting blocks)
  if (rec.production?.producesIds) {
    for (const pid of rec.production.producesIds) {
      checkId(pid, `${path}#${rec.id}.production.producesIds`);
    }
  }
  // ammunition.usedBy (block ids)
  if (rec.type === "ammunition" && Array.isArray(rec.usedBy)) {
    for (const bid of rec.usedBy) {
      checkId(bid, `${path}#${rec.id}.usedBy`);
    }
  }
  // fuel.consumesId on reactors etc.
  if (rec.fuel?.consumesId) {
    checkId(rec.fuel.consumesId, `${path}#${rec.id}.fuel.consumesId`);
  }
}

if (unresolved.length > 0) {
  console.error(`✗ ${unresolved.length} unresolved cross-reference(s):`);
  for (const u of unresolved) {
    console.error(`    ${u.id}  ← ${u.where}`);
    errors++;
  }
} else {
  console.log("✓ All cross-references resolve");
}

// 3. Orphan report (warning only)
// A consumable item is "orphaned" if no one references it via buildComponents,
// recipes.ingredients, producesIds, usedBy, or fuel.consumesId.
const referenced = new Set();
for (const { record: rec } of registry.values()) {
  if (Array.isArray(rec.buildComponents)) {
    for (const c of rec.buildComponents) referenced.add(c.id);
  }
  if (Array.isArray(rec.recipes)) {
    for (const r of rec.recipes) {
      for (const ing of r.ingredients ?? []) referenced.add(ing.id);
    }
  }
  if (rec.production?.producesIds) {
    for (const pid of rec.production.producesIds) referenced.add(pid);
  }
  if (rec.type === "ammunition" && Array.isArray(rec.usedBy)) {
    for (const bid of rec.usedBy) referenced.add(bid);
  }
  if (rec.fuel?.consumesId) referenced.add(rec.fuel.consumesId);
}

// Items that could be consumed by something but aren't: refinery products,
// components, ammunition. Raw resources are leaves, blocks are end products,
// character gear is player-equipped — all expected to be "unreferenced" as
// outputs, so skip those types.
const consumableTypes = new Set([
  "refinery_product",
  "simple_component",
  "complex_component",
  "high_tech_component",
  "ammunition",
  "power_cell",
]);

const orphans = [];
for (const { path, record: rec } of registry.values()) {
  if (!consumableTypes.has(rec.type)) continue;
  if (rec.gameStatus !== "active") continue;
  if (referenced.has(rec.id)) continue;
  // Some items declare their consumers via reverse-direction fields
  // (ammunition.usedBy → weapon block ids; power_cell.usedIn → battery
  // block names). Treat those as "referenced" since they close the graph
  // from the other side.
  if (Array.isArray(rec.usedBy) && rec.usedBy.length > 0) continue;
  if (Array.isArray(rec.usedIn) && rec.usedIn.length > 0) continue;
  orphans.push({ id: rec.id, type: rec.type, path });
}

if (orphans.length > 0) {
  console.warn(`⚠ ${orphans.length} orphan consumable(s) — active items not referenced by any recipe/block:`);
  for (const o of orphans) {
    console.warn(`    ${o.id}  (${o.type})  in ${o.path}`);
    warnings++;
  }
} else {
  console.log("✓ No orphan consumables");
}

console.log("");
if (errors > 0) {
  console.error(`${errors} error(s), ${warnings} warning(s)`);
  process.exit(1);
}
if (warnings > 0) {
  console.warn(`0 errors, ${warnings} warning(s) — see above`);
  process.exit(0);
}
console.log("Data quality checks passed.");
