#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const load = (p) => JSON.parse(readFileSync(resolve(repoRoot, p), "utf8"));

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats.default(ajv);

const envelopeSchema = load("schemas/envelope.schema.json");
const rawSchema = load("schemas/resource-raw.schema.json");
const itemSchema = load("schemas/resource-item.schema.json");
const blockSchema = load("schemas/resource-block.schema.json");
const fluidGasSchema = load("schemas/resource-fluid-gas.schema.json");
const indexSchema = load("schemas/index.schema.json");

const validateEnvelope = ajv.compile(envelopeSchema);
const validateRaw = ajv.compile(rawSchema);
const validateItem = ajv.compile(itemSchema);
const validateBlock = ajv.compile(blockSchema);
const validateFluidGas = ajv.compile(fluidGasSchema);
const validateIndex = ajv.compile(indexSchema);

const index = load("index.json");

const recordSchemaFor = (datasetId) => {
  if (datasetId === "raw-resources") return { kind: "raw", fn: validateRaw };
  if (datasetId === "gases" || datasetId === "fluids") {
    return { kind: "fluid-gas", fn: validateFluidGas };
  }
  // Power cells live under data/blocks/power/ for folder-level grouping with
  // the battery blocks that consume them, but the records themselves are
  // items (no size_m/pcu), so they validate against the item schema.
  if (datasetId === "blocks-power-cells") return { kind: "item", fn: validateItem };
  if (datasetId.startsWith("blocks-")) return { kind: "block", fn: validateBlock };
  return { kind: "item", fn: validateItem };
};

let failures = 0;
const report = (label, errors) => {
  if (!errors || errors.length === 0) return;
  failures += errors.length;
  console.error(`✗ ${label}`);
  for (const err of errors) {
    console.error(`    ${err.instancePath || "(root)"} ${err.message}`);
    if (err.params && Object.keys(err.params).length) {
      console.error(`      params: ${JSON.stringify(err.params)}`);
    }
  }
};

// Validate index.json itself
if (!validateIndex(index)) {
  report("index.json", validateIndex.errors);
} else {
  console.log("✓ index.json");
}

// Validate each dataset
for (const entry of index.datasets) {
  const data = load(entry.path);
  const label = `${entry.path}`;

  if (!validateEnvelope(data)) {
    report(`${label} (envelope)`, validateEnvelope.errors);
    continue;
  }

  const { kind, fn } = recordSchemaFor(entry.id);
  let recordFailures = 0;
  for (const [i, rec] of data.resources.entries()) {
    if (!fn(rec)) {
      recordFailures += fn.errors.length;
      report(`${label} [${i}] (${kind} record "${rec.id ?? "?"}")`, fn.errors);
    }
  }
  if (data.resources.length !== entry.entryCount) {
    console.error(
      `✗ ${label} — index declares ${entry.entryCount} entries but file has ${data.resources.length}`,
    );
    failures += 1;
  }
  if (recordFailures === 0) {
    console.log(`✓ ${label} (${data.resources.length} ${kind} records)`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} validation error(s)`);
  process.exit(1);
}
console.log("\nAll datasets valid.");
