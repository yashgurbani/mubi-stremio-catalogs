import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("curated/manifest.json", root), "utf8"));
const cache = new Map();

async function getMeta(type, id) {
  const key = `${type}:${id}`;
  if (cache.has(key)) return cache.get(key);
  const response = await fetch(`https://v3-cinemeta.strem.io/meta/${type}/${id}.json`);
  if (!response.ok) throw new Error(`Cinemeta returned ${response.status} for ${key}`);
  const payload = await response.json();
  if (!payload.meta?.poster) {
    const fallback = { ...payload.meta, poster: `https://images.metahub.space/poster/medium/${id}/img` };
    cache.set(key, fallback);
    return fallback;
  }
  cache.set(key, payload.meta);
  return payload.meta;
}

for (const catalog of manifest.catalogs) {
  const file = new URL(`curated/catalog/${catalog.type}/${catalog.id}.json`, root);
  const payload = JSON.parse(await readFile(file, "utf8"));
  const metas = [];
  for (const item of payload.metas) {
    const meta = await getMeta(catalog.type, item.id);
    metas.push({
      ...item,
      poster: meta.poster,
      background: meta.background,
      logo: meta.logo,
      description: meta.description,
      genres: meta.genres ?? meta.genre,
      imdbRating: meta.imdbRating,
      country: meta.country,
      director: meta.director,
    });
  }
  await writeFile(file, `${JSON.stringify({ metas }, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({ catalogs: manifest.catalogs.length, enriched: cache.size }));
