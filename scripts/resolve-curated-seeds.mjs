import { mkdir, writeFile } from "node:fs/promises";

const catalogs = [
  {
    id: "for-you-intimate-thoughtful-cinema",
    type: "movie",
    titles: [
      ["Columbus", 2017],
      ["The Worst Person in the World", 2021],
      ["Aftersun", 2022],
      ["Petite Maman", 2021],
      ["All of Us Strangers", 2023],
      ["A Separation", 2011],
      ["Wheel of Fortune and Fantasy", 2021],
      ["Portrait of a Lady on Fire", 2019],
      ["The Green Ray", 1986],
      ["Oslo, August 31st", 2011],
      ["Yi Yi", 2000],
      ["Certified Copy", 2010],
    ],
  },
  {
    id: "for-you-global-arthouse-formal-discovery",
    type: "movie",
    titles: [
      ["Close-Up", 1990],
      ["Beau Travail", 1999],
      ["Tropical Malady", 2004],
      ["Uncle Boonmee Who Can Recall His Past Lives", 2010],
      ["The Spirit of the Beehive", 1973],
      ["News from Home", 1976],
      ["Touki Bouki", 1973],
      ["The House Is Black", 1963],
      ["Still Life", 2006],
      ["Syndromes and a Century", 2006],
      ["A Brighter Summer Day", 1991],
      ["Distant Voices, Still Lives", 1988],
    ],
  },
  {
    id: "for-you-indian-indie-regional",
    type: "movie",
    titles: [
      ["Court", 2014],
      ["Ankhon Dekhi", 2013],
      ["The Fourth Direction", 2015],
      ["Tumbbad", 2018],
      ["Sairat", 2016],
      ["Fandry", 2013],
      ["Killa", 2014],
      ["Super Deluxe", 2019],
      ["Kumbalangi Nights", 2019],
      ["Thithi", 2015],
      ["Ee.Ma.Yau", 2018],
      ["The Disciple", 2020],
      ["Kaaka Muttai", 2014],
      ["Village Rockstars", 2017],
      ["Aamis", 2019],
      ["All We Imagine as Light", 2024],
      ["Girls Will Be Girls", 2024],
      ["Pebbles", 2021],
      ["Nasir", 2020],
      ["Kottukkaali", 2024],
      ["Aattam", 2023],
      ["Joram", 2023],
      ["Three of Us", 2022],
      ["The Great Indian Kitchen", 2021],
    ],
  },
  {
    id: "for-you-documentary-discovery",
    type: "movie",
    titles: [
      ["Particle Fever", 2013],
      ["The Farthest", 2017],
      ["Apollo 11", 2019],
      ["Fire of Love", 2022],
      ["The Act of Killing", 2012],
      ["Collective", 2019],
      ["The Look of Silence", 2014],
      ["For Sama", 2019],
      ["Cameraperson", 2016],
      ["Sans Soleil", 1983],
      ["Stories We Tell", 2012],
      ["Honeyland", 2019],
      ["Nostalgia for the Light", 2010],
      ["All That Breathes", 2022],
      ["The Rescue", 2021],
      ["Writing with Fire", 2021],
      ["Machines", 2016],
      ["A Night of Knowing Nothing", 2021],
      ["AlphaGo", 2017],
      ["Human Nature", 2019],
      ["The Bit Player", 2018],
    ],
  },
  {
    id: "for-you-prestige-tv-beyond-obvious",
    type: "series",
    titles: [
      ["Severance", 2022],
      ["The Leftovers", 2014],
      ["The Americans", 2013],
      ["Halt and Catch Fire", 2014],
      ["Better Call Saul", 2015],
      ["Succession", 2018],
      ["Pachinko", 2022],
      ["Station Eleven", 2021],
      ["The Bureau", 2015],
      ["Reservation Dogs", 2021],
      ["The Bear", 2022],
      ["The Knick", 2014],
      ["Rectify", 2013],
      ["Andor", 2022],
      ["Delhi Crime", 2019],
      ["Paatal Lok", 2020],
      ["Kohrra", 2023],
      ["Suzhal: The Vortex", 2022],
      ["My Brilliant Friend", 2018],
      ["Babylon Berlin", 2017],
      ["Borgen", 2010],
      ["The Bridge", 2011],
      ["My Mister", 2018],
      ["Giri/Haji", 2019],
      ["The Long Season", 2023],
      ["The Investigation", 2020],
    ],
  },
  {
    id: "for-you-smart-ensemble-comedy",
    type: "series",
    titles: [
      ["Party Down", 2009],
      ["Veep", 2012],
      ["Abbott Elementary", 2021],
      ["The Good Place", 2016],
      ["Silicon Valley", 2014],
      ["Derry Girls", 2018],
      ["Schitt's Creek", 2015],
      ["Detectorists", 2014],
      ["Fleabag", 2016],
      ["What We Do in the Shadows", 2019],
      ["Superstore", 2015],
      ["Somebody Somewhere", 2022],
      ["Atlanta", 2016],
      ["Catastrophe", 2015],
      ["Panchayat", 2020],
      ["Gullak", 2019],
      ["Permanent Roommates", 2014],
      ["Fisk", 2021],
      ["This Country", 2017],
      ["Kim's Convenience", 2016],
    ],
  },
  {
    id: "for-you-dark-strange-animation",
    type: "series",
    titles: [
      ["Undone", 2019],
      ["Scavengers Reign", 2023],
      ["Pantheon", 2022],
      ["The Midnight Gospel", 2020],
      ["Moral Orel", 2005],
      ["Inside Job", 2021],
      ["Smiling Friends", 2020],
      ["The Boondocks", 2005],
      ["Archer", 2009],
      ["Invincible", 2021],
      ["Primal", 2019],
      ["Cyberpunk: Edgerunners", 2022],
      ["Devilman Crybaby", 2018],
      ["Odd Taxi", 2021],
    ],
  },
  {
    id: "comfort-animation-whimsy",
    type: "series",
    titles: [
      ["Doraemon", 1979],
      ["Kiteretsu", 1988],
      ["Crayon Shin-chan", 1992],
      ["Tom and Jerry", 1940],
      ["SWAT Kats", 1993],
      ["Phineas and Ferb", 2007],
      ["The Simpsons", 1989],
      ["Bluey", 2018],
      ["Hilda", 2018],
      ["Bee and PuppyCat", 2013],
      ["We Bare Bears", 2014],
      ["Adventure Time", 2010],
      ["Shaun the Sheep", 2007],
      ["Over the Garden Wall", 2014],
      ["The Disastrous Life of Saiki K.", 2016],
      ["Nichijou", 2011],
    ],
  },
];

async function resolve(type, title, year) {
  const overrides = {
    "movie:The House Is Black:1963": "tt0336693",
    "series:Crayon Shin-chan:1992": "tt30051683",
  };
  const overrideId = overrides[`${type}:${title}:${year}`];
  if (overrideId) {
    const response = await fetch(
      `https://v3-cinemeta.strem.io/meta/${type}/${overrideId}.json`,
    );
    const payload = await response.json();
    return {
      query: { title, year },
      match: {
        id: payload.meta.id,
        type,
        name: payload.meta.name,
        releaseInfo: payload.meta.releaseInfo,
      },
      confidence: "manual-imdb-override-verified-with-cinemeta",
    };
  }

  const endpoint = `https://v3-cinemeta.strem.io/catalog/${type}/top/search=${encodeURIComponent(title)}.json`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`${response.status} ${endpoint}`);
  }

  const payload = await response.json();
  const normalized = title.toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, "");
  const exact = payload.metas?.find((meta) => {
    const candidate = meta.name.toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, "");
    return candidate === normalized && Number(meta.releaseInfo?.slice(0, 4)) === year;
  });
  const sameYear = payload.metas?.find(
    (meta) => Number(meta.releaseInfo?.slice(0, 4)) === year,
  );
  const match = exact ?? sameYear ?? payload.metas?.[0];

  return {
    query: { title, year },
    match: match
      ? {
          id: match.id,
          type,
          name: match.name,
          releaseInfo: match.releaseInfo,
        }
      : null,
    confidence: exact ? "exact-title-and-year" : sameYear ? "year-only" : "first-result",
  };
}

const result = await Promise.all(
  catalogs.map(async (catalog) => ({
    id: catalog.id,
    type: catalog.type,
    items: await Promise.all(
      catalog.titles.map(([title, year]) => resolve(catalog.type, title, year)),
    ),
  })),
);

if (process.argv.includes("--write")) {
  const allowedAliasQueries = new Set([
    "movie:Ee.Ma.Yau:2018",
    "movie:Kaaka Muttai:2014",
    "movie:Aamis:2019",
    "movie:Kottukkaali:2024",
    "series:Kiteretsu:1988",
    "series:SWAT Kats:1993",
    "series:Nichijou:2011",
  ]);
  const catalogRoot = new URL("../curated/catalog/", import.meta.url);

  for (const catalog of result) {
    const metas = catalog.items.map((item) => {
      if (!item.match) {
        throw new Error(`No Cinemeta match: ${JSON.stringify(item.query)}`);
      }
      const queryKey = `${catalog.type}:${item.query.title}:${item.query.year}`;
      if (
        !item.confidence.startsWith("exact-") &&
        !item.confidence.startsWith("manual-") &&
        !allowedAliasQueries.has(queryKey)
      ) {
        throw new Error(
          `Low-confidence match for ${queryKey}: ${JSON.stringify(item.match)}`,
        );
      }
      return item.match;
    });
    const destination = new URL(`${catalog.type}/${catalog.id}.json`, catalogRoot);
    await mkdir(new URL(`${catalog.type}/`, catalogRoot), { recursive: true });
    await writeFile(destination, `${JSON.stringify({ metas }, null, 2)}\n`, "utf8");
  }
  console.log(
    JSON.stringify(
      result.map((catalog) => ({ id: catalog.id, items: catalog.items.length })),
      null,
      2,
    ),
  );
} else {
  console.log(JSON.stringify(result, null, 2));
}
