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

const curatedRoot = new URL("../curated/", import.meta.url);
const curatedManifest = JSON.parse(
  await readFile(new URL("manifest.json", curatedRoot), "utf8"),
);

if (curatedManifest.resources?.includes("catalog") !== true) {
  throw new Error("curated/manifest.json must expose the catalog resource");
}

if (!Array.isArray(curatedManifest.catalogs) || curatedManifest.catalogs.length === 0) {
  throw new Error("curated/manifest.json has no catalogs");
}

const curatedIds = new Set();
const curatedSummary = [];

for (const catalog of curatedManifest.catalogs) {
  if (catalog.type !== "movie" || !catalog.id || !catalog.name) {
    throw new Error(`Invalid curated manifest catalog: ${JSON.stringify(catalog)}`);
  }

  const payloadPath = new URL(`catalog/movie/${catalog.id}.json`, curatedRoot);
  const payload = JSON.parse(await readFile(payloadPath, "utf8"));

  if (!Array.isArray(payload.metas) || payload.metas.length === 0) {
    throw new Error(`${catalog.id} has no curated metas`);
  }

  for (const meta of payload.metas) {
    if (
      meta.type !== "movie" ||
      !/^tt\d+$/.test(meta.id) ||
      typeof meta.name !== "string" ||
      meta.name.length === 0
    ) {
      throw new Error(`Invalid curated meta in ${catalog.id}: ${JSON.stringify(meta)}`);
    }

    if (curatedIds.has(meta.id)) {
      throw new Error(`Duplicate IMDb ID across curated catalogs: ${meta.id}`);
    }
    curatedIds.add(meta.id);
  }

  curatedSummary.push({
    id: catalog.id,
    name: catalog.name,
    items: payload.metas.length,
  });
}

const curatedSources = JSON.parse(
  await readFile(new URL("sources.json", curatedRoot), "utf8"),
);
const sourceIds = new Set(curatedSources.catalogs?.map((source) => source.id));

for (const catalog of curatedManifest.catalogs) {
  if (!sourceIds.has(catalog.id)) {
    throw new Error(`Missing provenance for curated catalog: ${catalog.id}`);
  }
}

console.log(
  JSON.stringify(
    {
      valid: true,
      addon: curatedManifest.id,
      catalogs: curatedSummary,
      uniqueItems: curatedIds.size,
    },
    null,
    2,
  ),
);
