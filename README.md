# space-engineer-2-base-game

Central, machine-readable reference for **Space Engineers 2** base game data.
Companion mod repositories consume this data instead of scraping the wiki
individually.

## Data

| Dataset | Path | Contents |
| --- | --- | --- |
| Raw resources | [`data/raw-resources.json`](./data/raw-resources.json) | 13 ores + Ice + Stone (15 entries) |
| Refinery products | [`data/refinery-products.json`](./data/refinery-products.json) | Items crafted from ores in the Refinery 7.5 m (9 entries) |
| Simple components | [`data/simple-components.json`](./data/simple-components.json) | Items crafted in the Smelter 2.5 m or via Backpack Building (13 entries) |
| Complex components | [`data/complex-components.json`](./data/complex-components.json) | Items crafted in the Assembler 5 m (10 entries) |
| High-tech components | [`data/high-tech-components.json`](./data/high-tech-components.json) | Items crafted in the Fabricator 10 m (7 entries) |
| Power cells | [`data/power-cells.json`](./data/power-cells.json) | Swappable battery internals — Power Cell (active), Power Module (disabled) (2 entries) |
| Character gear | [`data/character-gear.json`](./data/character-gear.json) | Tools, weapons, and consumables crafted in the Gearforge 2.5 m (19 entries) |
| Blocks — production | [`data/blocks/production.json`](./data/blocks/production.json) | Smelter, Gearforge, Refinery, Assembler, Fabricator (5 entries) |
| Blocks — power | [`data/blocks/power.json`](./data/blocks/power.json) | Reactors, batteries, solar panels (7 entries) |
| Blocks — tools | [`data/blocks/tools.json`](./data/blocks/tools.json) | Ship-mounted drills, grinders, welders (6 entries) |
| Blocks — thrusters | [`data/blocks/thrusters.json`](./data/blocks/thrusters.json) | Atmospheric, ion, and hydrogen thrusters (12 entries) |
| Blocks — storage | [`data/blocks/storage.json`](./data/blocks/storage.json) | Cargo containers, hydrogen/oxygen tanks, locker/crate/barrel (10 entries) |
| Blocks — weapons | [`data/blocks/weapons.json`](./data/blocks/weapons.json) | Gatling Cannon, Gatling Turret (2 entries) |
| Blocks — gas production | [`data/blocks/gas-production.json`](./data/blocks/gas-production.json) | O2/H2 Generators (2 entries) |
| Blocks — conveyors | [`data/blocks/conveyors.json`](./data/blocks/conveyors.json) | Conveyor pipes, junctions, sorters, adaptors (17 entries) |
| Blocks — mechanical | [`data/blocks/mechanical.json`](./data/blocks/mechanical.json) | Pistons, rotors, gyroscopes + their heads (11 entries) |
| Blocks — detection | [`data/blocks/detection.json`](./data/blocks/detection.json) | Antennas, ore detectors (4 entries) |
| Blocks — docking | [`data/blocks/docking.json`](./data/blocks/docking.json) | Landing Gear, Connectors (4 entries) |
| Blocks — gravity | [`data/blocks/gravity.json`](./data/blocks/gravity.json) | Gravity Generator 5 m (1 entry) |
| Blocks — cockpits | [`data/blocks/cockpits.json`](./data/blocks/cockpits.json) | Cockpit, Control Seat, Seat (3 entries) |
| Blocks — lights | [`data/blocks/lights.json`](./data/blocks/lights.json) | Interior / corner lights + spotlights (5 entries) |
| Blocks — life support | [`data/blocks/life-support.json`](./data/blocks/life-support.json) | Survival Kit, Medical Room (3 entries) |
| Blocks — controls | [`data/blocks/controls.json`](./data/blocks/controls.json) | Button, Button Panel (2 entries, all planned) |
| Blocks — terminals | [`data/blocks/terminals.json`](./data/blocks/terminals.json) | Contract Terminal, Trade Terminal (2 entries) |
| Blocks — doors | [`data/blocks/doors.json`](./data/blocks/doors.json) | Narrow Sliding Door (1 entry) |
| Blocks — furniture | [`data/blocks/furniture.json`](./data/blocks/furniture.json) | Bed, Toilet (2 entries, all planned) |
| Ammunition | [`data/ammunition.json`](./data/ammunition.json) | Gatling Ammo Box, Rifle Magazine, Rocket (3 entries) |

Blocks live under `data/blocks/<subcategory>.json` — split by function
(production, energy, tools, thrusters, storage, etc.) rather than one
276-entry file. Block records use a different recipe shape: `buildComponents`
(on-site welding) instead of `recipes`, plus block-specific fields like
`size_m`, `pcu`, `snapSize`, `power`, `production`, `inventory`, `unlock`.

Character gear records include a `subcategory` field
(`"tool" | "weapon" | "consumable"`). A few gear recipes reference complex
components (`pressure_pipe`, `heavy_duty_plate`, `combustion_chamber`) produced
by the Assembler 5 m but not yet modeled here; they are listed under each
item's `dataGaps`.

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
