import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const accountStateUrl = new URL("private/account-state.json", root);

async function getJson(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "mubi-stremio-catalogs-maintenance" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return response.json();
}

let account;
try {
  account = JSON.parse(await readFile(accountStateUrl, "utf8"));
} catch (error) {
  if (error?.code === "ENOENT") {
    console.log(
      JSON.stringify(
        {
          skipped: true,
          reason: "private/account-state.json is not available",
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }
  throw error;
}

const [aioStreams, aioMetadata, watchlyHtml, curated] = await Promise.all([
  getJson("https://aiostreams.elfhosted.com/stremio/manifest.json"),
  getJson("https://aiometadata.elfhosted.com/manifest.json"),
  fetch("https://watchly.elfhosted.com/", {
    headers: { "user-agent": "mubi-stremio-catalogs-maintenance" },
  }).then(async (response) => {
    if (!response.ok) throw new Error(`${response.status} Watchly homepage`);
    return response.text();
  }),
  getJson(
    "https://yashgurbani.github.io/mubi-stremio-catalogs/curated/manifest.json",
  ),
]);

const watchlyVersion = watchlyHtml.match(/v(\d+\.\d+\.\d+)/)?.[1] ?? null;
const publicVersions = {
  AIOStreams: aioStreams.version,
  Watchly: watchlyVersion,
  AIOMetadata: aioMetadata.version,
  "Curated Discovery": curated.version,
};

const installedVersions = account.installedAddons ?? {};
const installedVersionDrift = Object.entries(installedVersions)
  .filter(([name, version]) => publicVersions[name] && publicVersions[name] !== version)
  .map(([name, installed]) => ({
    name,
    installed,
    public: publicVersions[name],
  }));

const homepage = account.homepage ?? {};
const findings = [];
if (!account.curatedDiscoveryInstalled) {
  findings.push("Curated Discovery is not installed on the real Stremio account.");
}
if (!account.aiometadataSignedIn) {
  findings.push("AIOMetadata account configuration is not signed in.");
}
if ((homepage.largeCatalogRows ?? 0) > 100) {
  findings.push(
    `${homepage.largeCatalogRows} rows come from ${homepage.largeCatalogAddonParts} large catalog addon parts.`,
  );
}
if (!account.requiredRows?.simklMovieSeriesAnimeWatchlistsVerified) {
  findings.push("Simkl movie, series, and anime watchlist rows are not verified.");
}

const result = {
  generatedAt: new Date().toISOString(),
  snapshotCapturedAt: account.capturedAt,
  publicVersions,
  installedVersionDrift,
  homepage,
  findings,
  actionGate: {
    requiresApproval: true,
    reason:
      "The remaining steps change signed-in accounts or uninstall installed addons.",
  },
};

console.log(JSON.stringify(result, null, 2));

if (
  process.argv.includes("--fail-on-risk") &&
  (installedVersionDrift.length > 0 || findings.length > 0)
) {
  process.exitCode = 2;
}
