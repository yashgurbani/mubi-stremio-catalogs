import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const profile = JSON.parse(
  await readFile(new URL("private/taste-profile.json", root), "utf8"),
);

const yearOverrides = {
  "Licorice Pizza": 2021,
  "Marriage Story": 2019,
  "Back to the Future": 1985,
  Moneyball: 2011,
  "The Sky Is Pink": 2019,
  "All the Bright Places": 2020,
  "The Namesake": 2006,
  "Dhobi Ghat": 2010,
  "Laapataa Ladies": 2023,
  "Past Lives": 2023,
  Her: 2013,
  "Lost in Translation": 2003,
  "(500) Days of Summer": 2009,
};

const idOverrides = {
  "Laapataa Ladies": "tt21626284",
  Her: "tt1798709",
  "Dhobi Ghat": "tt1433810",
};

function normalize(value) {
  return value.toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, "");
}

function csv(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function resolve(entry) {
  const year = entry.year ?? yearOverrides[entry.title];
  const overrideId = idOverrides[entry.title];
  if (overrideId) {
    const response = await fetch(
      `https://v3-cinemeta.strem.io/meta/movie/${overrideId}.json`,
    );
    if (!response.ok) throw new Error(`${response.status} ${entry.title}`);
    const payload = await response.json();
    return {
      Type: "movie",
      IMDB_ID: payload.meta.id,
      Title: payload.meta.name,
      Year: Number(String(payload.meta.releaseInfo).slice(0, 4)),
      Watchlist: "plan to watch",
    };
  }
  const endpoint = `https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURIComponent(entry.title)}.json`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`${response.status} ${entry.title}`);
  const payload = await response.json();
  const match = payload.metas?.find(
    (candidate) =>
      normalize(candidate.name) === normalize(entry.title) &&
      (!year || Number(String(candidate.releaseInfo).slice(0, 4)) === year),
  );
  if (!match) {
    throw new Error(`No exact Cinemeta match for ${entry.title} (${year ?? "year unknown"})`);
  }
  return {
    Type: "movie",
    IMDB_ID: match.id,
    Title: match.name,
    Year: Number(String(match.releaseInfo).slice(0, 4)),
    Watchlist: "plan to watch",
  };
}

const entries = profile.explicitWatchlist.filter(
  (entry) => entry.type === "movie" && entry.status === "watchlist",
);
const resolved = await Promise.all(entries.map(resolve));
const headers = ["Type", "IMDB_ID", "Title", "Year", "Watchlist"];
const body = [
  headers.join(","),
  ...resolved.map((entry) => headers.map((header) => csv(entry[header])).join(",")),
].join("\r\n");

const destination = new URL("private/simkl-plan-to-watch-import.csv", root);
await writeFile(destination, `${body}\r\n`, "utf8");
console.log(
  JSON.stringify(
    {
      destination: decodeURIComponent(destination.pathname),
      items: resolved.length,
      titles: resolved.map(({ IMDB_ID, Title, Year }) => ({ IMDB_ID, Title, Year })),
      excluded: profile.explicitWatchlist
        .filter((entry) => entry.type !== "movie" || entry.status !== "watchlist")
        .map(({ title, status }) => ({ title, status })),
    },
    null,
    2,
  ),
);
