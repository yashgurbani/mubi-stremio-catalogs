import { readFile } from "node:fs/promises";

const useLocalCatalogs = process.argv.includes("--local");
const baseUrl = "https://yashgurbani.github.io/mubi-stremio-catalogs/curated";

async function getCatalogJson(relativePath) {
  if (useLocalCatalogs) {
    const url = new URL(`../curated/${relativePath}`, import.meta.url);
    return JSON.parse(await readFile(url, "utf8"));
  }
  return getJson(`${baseUrl}/${relativePath}`);
}

async function getJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return response.json();
}

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function histogram(values) {
  return Object.fromEntries(
    [...new Set(values)]
      .sort((a, b) => String(a).localeCompare(String(b)))
      .map((value) => [value, values.filter((candidate) => candidate === value).length]),
  );
}

const manifest = await getCatalogJson("manifest.json");
const rows = await Promise.all(
  manifest.catalogs.map(async (catalog) => {
    const payload = await getCatalogJson(
      `catalog/${catalog.type}/${catalog.id}.json`,
    );
    const items = await Promise.all(
      payload.metas.map(async (entry) => {
        const payload = await getJson(
          `https://v3-cinemeta.strem.io/meta/${entry.type}/${entry.id}.json`,
        );
        const meta = payload.meta;
        const year = Number(String(meta.releaseInfo ?? "").slice(0, 4)) || null;
        const rating = Number.parseFloat(meta.imdbRating);
        return {
          id: meta.id,
          name: meta.name,
          year,
          decade: year ? `${Math.floor(year / 10) * 10}s` : "unknown",
          rating: Number.isFinite(rating) ? rating : null,
          genres: meta.genres ?? [],
          country: meta.country ?? "unknown",
          awards: meta.awards ?? null,
        };
      }),
    );
    const ratings = items.flatMap((item) =>
      item.rating === null ? [] : [item.rating],
    );
    const genres = items.flatMap((item) => item.genres);
    const countries = items.map((item) => item.country);
    const decades = items.map((item) => item.decade);

    return {
      id: catalog.id,
      type: catalog.type,
      name: catalog.name,
      items: items.length,
      ratingCoverage: Number((ratings.length / items.length).toFixed(2)),
      averageRating:
        ratings.length === 0
          ? null
          : Number(
              (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2),
            ),
      medianRating: median(ratings),
      ratedAtLeast75: items.filter((item) => item.rating >= 7.5).length,
      ratedBelow65: items
        .filter((item) => item.rating !== null && item.rating < 6.5)
        .map(({ id, name, rating }) => ({ id, name, rating })),
      unrated: items
        .filter((item) => item.rating === null)
        .map(({ id, name }) => ({ id, name })),
      genreCoverage: histogram(genres),
      countryCoverage: histogram(countries),
      decadeCoverage: histogram(decades),
    };
  }),
);

const result = {
  generatedAt: new Date().toISOString(),
  addon: manifest.id,
  version: manifest.version,
  rows,
  totals: {
    catalogs: rows.length,
    items: rows.reduce((sum, row) => sum + row.items, 0),
    lowRatedItems: rows.reduce((sum, row) => sum + row.ratedBelow65.length, 0),
    unratedItems: rows.reduce((sum, row) => sum + row.unrated.length, 0),
  },
  interpretation:
    "Ratings are one diagnostic signal. Do not remove festival, archival, regional, or formally important titles only because their audience rating is low or absent.",
};

console.log(JSON.stringify(result, null, 2));
