import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const privateProfileUrl = new URL("private/taste-profile.json", root);
const curatedRoot = new URL("curated/", root);

function normalizeTitle(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

let profile;
try {
  profile = JSON.parse(await readFile(privateProfileUrl, "utf8"));
} catch (error) {
  if (error?.code === "ENOENT") {
    console.log(
      JSON.stringify(
        {
          skipped: true,
          reason: "private/taste-profile.json is not available",
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }
  throw error;
}

const profileTitles = new Map();
for (const item of profile.watchedSeries ?? []) {
  profileTitles.set(normalizeTitle(item.title), {
    kind: "watched",
    title: item.title,
  });
}
for (const item of profile.explicitWatchlist ?? []) {
  profileTitles.set(normalizeTitle(item.title), {
    kind: "watchlist",
    title: item.title,
  });
}

const manifest = JSON.parse(
  await readFile(new URL("manifest.json", curatedRoot), "utf8"),
);
const overlaps = [];
let itemCount = 0;

for (const catalog of manifest.catalogs) {
  const payload = JSON.parse(
    await readFile(
      new URL(`catalog/${catalog.type}/${catalog.id}.json`, curatedRoot),
      "utf8",
    ),
  );
  itemCount += payload.metas.length;

  for (const meta of payload.metas) {
    const match = profileTitles.get(normalizeTitle(meta.name));
    if (match) {
      overlaps.push({
        catalog: catalog.id,
        id: meta.id,
        type: meta.type,
        kind: match.kind,
        profileTitle: match.title,
        catalogTitle: meta.name,
      });
    }
  }
}

const includeDetails = process.argv.includes("--details");
const result = {
  valid: overlaps.length === 0,
  catalogs: manifest.catalogs.length,
  curatedItems: itemCount,
  profileTitles: profileTitles.size,
  overlapCount: overlaps.length,
  ...(includeDetails ? { overlaps } : {}),
};

console.log(JSON.stringify(result, null, 2));

if (overlaps.length > 0 && process.argv.includes("--fail-on-overlap")) {
  process.exitCode = 2;
}
