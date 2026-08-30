import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("manifest.json", root), "utf8"));

if (manifest.resources?.includes("catalog") !== true) {
  throw new Error("manifest.json must expose the catalog resource");
}

if (!Array.isArray(manifest.catalogs) || manifest.catalogs.length !== 3) {
  throw new Error(`Expected 3 catalogs, found ${manifest.catalogs?.length ?? 0}`);
}

const allIds = new Set();
const summary = [];

for (const catalog of manifest.catalogs) {
  if (catalog.type !== "movie" || !catalog.id || !catalog.name) {
    throw new Error(`Invalid manifest catalog: ${JSON.stringify(catalog)}`);
  }

  const payloadPath = new URL(`catalog/movie/${catalog.id}.json`, root);
  const payload = JSON.parse(await readFile(payloadPath, "utf8"));

  if (!Array.isArray(payload.metas) || payload.metas.length === 0) {
    throw new Error(`${catalog.id} has no metas`);
  }

  for (const meta of payload.metas) {
    if (
      meta.type !== "movie" ||
      !/^tmdb:\d+$/.test(meta.id) ||
      typeof meta.name !== "string" ||
      meta.name.length === 0
    ) {
      throw new Error(`Invalid meta in ${catalog.id}: ${JSON.stringify(meta)}`);
    }
    if (allIds.has(meta.id)) {
      throw new Error(`Duplicate TMDB ID across editorial collections: ${meta.id}`);
    }
    allIds.add(meta.id);
  }

  summary.push({
    id: catalog.id,
    name: catalog.name,
    items: payload.metas.length,
  });
}

console.log(
  JSON.stringify(
    {
      valid: true,
      addon: manifest.id,
      catalogs: summary,
      uniqueItems: allIds.size,
    },
    null,
    2,
  ),
);
