const baseUrl =
  "https://yashgurbani.github.io/mubi-stremio-catalogs/curated";

async function getJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return response.json();
}

const manifest = await getJson(`${baseUrl}/manifest.json`);
const catalogResults = await Promise.all(
  manifest.catalogs.map(async (catalog) => {
    const payload = await getJson(
      `${baseUrl}/catalog/${catalog.type}/${catalog.id}.json`,
    );
    const resolutions = await Promise.all(
      payload.metas.map(async (meta) => {
        try {
          const resolved = await getJson(
            `https://v3-cinemeta.strem.io/meta/${meta.type}/${meta.id}.json`,
          );
          return {
            id: meta.id,
            resolved: Boolean(resolved.meta?.name),
            resolvedName: resolved.meta?.name ?? null,
          };
        } catch (error) {
          return { id: meta.id, resolved: false, error: String(error) };
        }
      }),
    );
    return {
      id: catalog.id,
      type: catalog.type,
      name: catalog.name,
      items: payload.metas.length,
      resolvedItems: resolutions.filter((item) => item.resolved).length,
      unresolved: resolutions.filter((item) => !item.resolved),
    };
  }),
);

const result = {
  healthy: catalogResults.every(
    (catalog) => catalog.items === catalog.resolvedItems,
  ),
  addon: manifest.id,
  version: manifest.version,
  catalogs: catalogResults,
  totalItems: catalogResults.reduce((sum, catalog) => sum + catalog.items, 0),
};

console.log(JSON.stringify(result, null, 2));
if (!result.healthy) {
  process.exitCode = 1;
}
