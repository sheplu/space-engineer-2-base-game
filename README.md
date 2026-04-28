# space-engineer-2-base-game

Central, machine-readable reference for **Space Engineers 2** base game data.
Companion mod repositories consume this data instead of scraping the wiki
individually.

## Data

| Dataset | Path | Contents |
| --- | --- | --- |
| Raw resources | [`data/raw-resources.json`](./data/raw-resources.json) | 13 ores + Ice + Stone (15 entries) |
| Refinery products | [`data/refinery-products.json`](./data/refinery-products.json) | Items crafted from ores in the Refinery 7.5 m (9 entries) |
| Components — simple | [`data/components/simple.json`](./data/components/simple.json) | Items crafted in the Smelter 2.5 m or via Backpack Building (13 entries) |
| Components — complex | [`data/components/complex.json`](./data/components/complex.json) | Items crafted in the Assembler 5 m (10 entries) |
| Components — high-tech | [`data/components/high-tech.json`](./data/components/high-tech.json) | Items crafted in the Fabricator 10 m (7 entries) |
| Character gear | [`data/character-gear.json`](./data/character-gear.json) | Tools, weapons, and consumables crafted in the Gearforge 2.5 m (19 entries) |
| Blocks — production / crafting | [`data/blocks/production/crafting.json`](./data/blocks/production/crafting.json) | Smelter, Gearforge, Refinery, Assembler, Fabricator (5 entries) |
| Blocks — power / generation | [`data/blocks/power/generation.json`](./data/blocks/power/generation.json) | Reactors, batteries, solar panels (7 entries) |
| Blocks — power / cells | [`data/blocks/power/cells.json`](./data/blocks/power/cells.json) | Swappable battery internals — Power Cell (active), Power Module (disabled) (2 entries) |
| Blocks — tools | [`data/blocks/tools.json`](./data/blocks/tools.json) | Ship-mounted drills, grinders, welders (6 entries) |
| Blocks — thrusters | [`data/blocks/thrusters.json`](./data/blocks/thrusters.json) | Atmospheric, ion, and hydrogen thrusters (12 entries) |
| Blocks — storage / containers | [`data/blocks/storage/containers.json`](./data/blocks/storage/containers.json) | Cargo containers, hydrogen/oxygen tanks, locker/crate/barrel (10 entries) |
| Blocks — storage / conveyors | [`data/blocks/storage/conveyors.json`](./data/blocks/storage/conveyors.json) | Conveyor pipes, junctions, sorters, adaptors (17 entries) |
| Blocks — weapons | [`data/blocks/weapons.json`](./data/blocks/weapons.json) | Gatling Cannon, Gatling Turret (2 entries) |
| Blocks — production / gas | [`data/blocks/production/gas.json`](./data/blocks/production/gas.json) | O2/H2 Generators (2 entries) |
| Blocks — mechanical | [`data/blocks/mechanical.json`](./data/blocks/mechanical.json) | Pistons, rotors, gyroscopes + their heads (11 entries) |
| Blocks — detection | [`data/blocks/detection.json`](./data/blocks/detection.json) | Antennas, ore detectors (4 entries) |
| Blocks — docking | [`data/blocks/docking.json`](./data/blocks/docking.json) | Landing Gear, Connectors (4 entries) |
| Blocks — gravity | [`data/blocks/gravity.json`](./data/blocks/gravity.json) | Gravity Generator 5 m (1 entry) |
| Blocks — control / cockpits | [`data/blocks/control/cockpits.json`](./data/blocks/control/cockpits.json) | Cockpit, Control Seat, Seat (3 entries) |
| Blocks — lights | [`data/blocks/lights.json`](./data/blocks/lights.json) | Interior / corner lights + spotlights (5 entries) |
| Blocks — life support | [`data/blocks/life-support.json`](./data/blocks/life-support.json) | Survival Kit, Medical Room (3 entries) |
| Blocks — control / controls | [`data/blocks/control/controls.json`](./data/blocks/control/controls.json) | Button, Button Panel (2 entries, all planned) |
| Blocks — control / terminals | [`data/blocks/control/terminals.json`](./data/blocks/control/terminals.json) | Contract Terminal, Trade Terminal (2 entries) |
| Blocks — doors | [`data/blocks/doors.json`](./data/blocks/doors.json) | Narrow Sliding Door (1 entry) |
| Blocks — furniture | [`data/blocks/furniture.json`](./data/blocks/furniture.json) | Interior/crew-quarter furniture — Bed, Toilet, Table, Shower, Sink, Deck Panel, Desk (7 entries; Bed/Toilet/Desk are planned stubs) |
| Blocks — armor / light | [`data/blocks/armor/light.json`](./data/blocks/armor/light.json) | Light Armor shape variants — cube, slope, corner, transition, wide-half, mirrored pairs, in 0.5 m / 2.5 m (plus 0.25 m / 1.25 m half-corner) (46 entries) |
| Blocks — armor / heavy | [`data/blocks/armor/heavy.json`](./data/blocks/armor/heavy.json) | Heavy Armor shape variants — same 23 shapes as light armor, built from Heavy-Duty Plate instead of Steel Plate (46 entries) |
| Blocks — structures / windows | [`data/blocks/structures/windows.json`](./data/blocks/structures/windows.json) | Transparent window shape variants — flat, slope, curved, triangle, quarter-sphere, slanted-long; 1.25 m / 2.5 m / 2.75 m / 5 m (28 entries) |
| Blocks — structures / structural | [`data/blocks/structures/structural.json`](./data/blocks/structures/structural.json) | Catwalks, handrails, detailing, structural support, truss blocks, stairs/ramp, cover wall (24 entries) |
| Blocks — structures / interior walls | [`data/blocks/structures/interior-walls.json`](./data/blocks/structures/interior-walls.json) | Room-partition walls — flat, corner, flat-half, corner-with-side, plus four pillar variants; all 2.5 m (9 entries) |
| Ammunition | [`data/ammunition.json`](./data/ammunition.json) | Gatling Ammo Box, Rifle Magazine, Rocket (3 entries) |

Blocks live under `data/blocks/<subcategory>.json` — split by function
(production, tools, thrusters, mechanical, etc.) rather than one
276-entry file. Some buckets group related subcategories into a folder:
`data/blocks/storage/` holds containers + conveyors, and
`data/blocks/power/` holds generation + swappable cells. Craftable items
(non-blocks) live at `data/components/` (simple, complex, high-tech tiers)
and `data/` (raw-resources, refinery-products, character-gear, ammunition).
Block records use a different recipe shape: `buildComponents` (on-site
welding) instead of `recipes`, plus block-specific fields like `size_m`,
`pcu`, `snapSize`, `power`, `production`, `inventory`, `unlock`.

Character gear records include a `subcategory` field
(`"tool" | "weapon" | "consumable"`). A few gear recipes reference complex
components (`pressure_pipe`, `heavy_duty_plate`, `combustion_chamber`) produced
by the Assembler 5 m but not yet modeled here; they are listed under each
item's `dataGaps`.

## Index

`index.json` at the repo root is a machine-readable directory of every dataset
in this repo — path, version, entry count, category. Mod consumers can fetch
this single file to discover everything without scraping the directory tree.

```bash
curl -sSL https://raw.githubusercontent.com/<org>/space-engineer-2-base-game/main/index.json
```

## Schema

Each dataset file follows the same envelope:

```json
{
  "version": "1.0.0",
  "generatedAt": "YYYY-MM-DD",
  "game": { "name": "Space Engineers 2", "stage": "Early Access", "dataAsOf": "YYYY-MM-DD" },
  "sources": ["..."],
  "notes": "...",
  "resources": [ /* records */ ]
}
```

JSON Schemas (draft 2020-12) live in [`schemas/`](./schemas/):

- `envelope.schema.json` — the shared wrapper
- `resource-raw.schema.json` — raw-resources records (ores, Ice, Stone)
- `resource-item.schema.json` — refinery products, components, character gear, ammunition, power cells
- `resource-block.schema.json` — all block records under `data/blocks/**`
- `index.schema.json` — the root `index.json`

Run the bundled checks:

```bash
npm install
npm run validate   # schema shape for every dataset + index.json
npm run quality    # cross-ref resolution, id uniqueness, orphan detection
npm run check      # both
```

Per-record fields for raw resources: `id`, `displayName`, `type`
(`"ore" | "material"`), `mass_kg`, `volume_liters`, `stackable`, `divisible`,
`description`, `gameStatus` (`"active" | "disabled" | "planned"`), `locations`
(`{ planets: [{ name, biomes[] }], asteroidFields: [] }`), `refinableInto`,
`wiki` (link to the resource's wiki page), and `dataGaps` listing fields where
official data is missing.

Per-record fields for craftable items (refinery products, components, gear):
`id`, `displayName`, `type`, `mass_kg`, `volume_liters`, `stackable`,
`divisible`, `description`, `gameStatus`, `recipes` (array of
`{ producedBy, ingredients: [{ id, qty }], producesQty, craftingTimeSeconds }`
— some items have multiple production paths, e.g. Smelter + Backpack),
`usedIn` (downstream recipe names), `wiki`, `dataGaps`. Ingredient `id` values
reference entries in other dataset files (e.g. `raw-resources.json`).

Fields with no published value are `null`, and the field name is added to
`dataGaps` so consumers can detect what is unknown vs. zero.

## Consuming from a mod repo

```bash
curl -sSL https://raw.githubusercontent.com/<org>/space-engineer-2-base-game/main/data/raw-resources.json
curl -sSL https://raw.githubusercontent.com/<org>/space-engineer-2-base-game/main/data/components/simple.json
curl -sSL https://raw.githubusercontent.com/<org>/space-engineer-2-base-game/main/data/blocks/storage/containers.json
```

Or with `jq`:

```bash
jq '.resources[] | select(.gameStatus == "active") | .id' data/raw-resources.json
```

## Source of truth

Primary source: [Space Engineers 2 Wiki](https://spaceengineers2.wiki.gg/).
Each record links its own wiki page under the `wiki` field.

Data is updated manually when the game or wiki changes. Bump `version` and
`generatedAt` / `game.dataAsOf` on each update.

## License

[MIT](./LICENSE)
