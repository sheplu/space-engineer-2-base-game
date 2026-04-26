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

More datasets (character gear, blocks, blueprints) will be added as separate
JSON files under `data/`.

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
