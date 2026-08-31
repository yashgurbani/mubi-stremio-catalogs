# MUBI Editorial Collections — Stremio Catalog Addon

This is a static, source-faithful Stremio catalog addon for three MUBI Germany editorial collections captured on 31 August 2026.

It contains:

- `AUSGEWÄHLT VON WIM WENDERS` — 4 films currently available in Germany
- `NEUE HORIZONTE: NEO-WESTERN` — 3 films
- `BEFORE BARBIE: GRETA GERWIG AND NOAH BAUMBACH` — 2 films

Every title is resolved to a specific TMDB ID. The addon does not generate, infer, or expand MUBI membership. Old snapshot files remain as an unlisted archive.

## Intended deployment

Publish this directory as a static HTTPS site whose root serves `manifest.json`. AIOMetadata can then import the manifest through **Custom Manifest Integration** and place the three catalogs at the end of Home.

GitHub Pages is sufficient because every collection contains fewer than 20 titles. No server, API key, database, Trakt connection, or MDBList slot is required.

## Maintenance audit

Run the credential-free service audit before a monthly update:

```powershell
powershell -NoProfile -File .\scripts\audit-services.ps1
```

The audit checks the public AIOStreams, AIOMetadata, Watchly, and catalog manifests. It also compares deployed versions with official GitHub releases.

Run the regional catalog quality audit separately:

```powershell
powershell -NoProfile -File .\scripts\audit-catalog-quality.ps1
```

The service audit calls `scripts/audit-curated-live.mjs`. This helper validates every deployed curated title against Cinemeta in parallel.

Run the curated quality diagnostic after each membership change:

```powershell
node .\scripts\audit-curated-quality.mjs --local
node .\scripts\audit-personal-overlap.mjs --fail-on-overlap
```

The diagnostic reports rating coverage, rating distribution, genres, countries, and decades. It never removes a title automatically.

The personal-overlap audit uses the ignored private taste profile when it is available. It reports counts by default and does not print private titles. Add `--details` only for local diagnosis.

This audit samples every Indian Regional Catalog row. It measures missing rating metadata, duplicates, promotional entries, identifier quality, and recency concentration. The output distinguishes broad freshness coverage from quality-curated discovery.

The AIOMetadata gate now reports two capabilities separately:

- whether the public version contains the Letterboxd URL-import repair from v2.16.3;
- whether MovieLens readiness is observable from the public service.

AIOMetadata does not publish its server-side MovieLens key through `/api/config`. The audit therefore reports MovieLens as `unknown`, not disabled. Use `-FailOnDrift` when release drift must return a nonzero exit code.

The full evidence ledger and maintenance decisions are in [DEEP-RESEARCH-2026-08-31.md](DEEP-RESEARCH-2026-08-31.md).

The row-quality scorecard and regional discovery policy are in [CATALOG-QUALITY-AUDIT-2026-08-31.md](CATALOG-QUALITY-AUDIT-2026-08-31.md).

The real-account comparison and remaining completion gates are in [LIVE-ACCOUNT-AUDIT-2026-08-31.md](LIVE-ACCOUNT-AUDIT-2026-08-31.md).

The included workflow validates all catalog payloads before deployment. After explicit approval to create the public repository, run from this directory:

```powershell
.\scripts\deploy-pages.ps1
```

The expected manifest URL is:

```text
https://yashgurbani.github.io/mubi-stremio-catalogs/manifest.json
```

## Monthly refresh rule

1. Review the corresponding logged-in MUBI Germany collection pages.
2. Preserve the official collection name and exact displayed membership.
3. Resolve additions to exact TMDB IDs.
4. Use only the films in MUBI's live collection payload. Do not infer films from the editorial description.
5. Update the capture date in the manifest description and catalog IDs.
6. Retain at most three MUBI editorial rows on the Stremio homepage.

Do not publish empty collection shells or AI-invented “MUBI-style” memberships.

## Curated discovery catalog

The repository also publishes a separate curated addon at:

```text
https://yashgurbani.github.io/mubi-stremio-catalogs/curated/manifest.json
```

The addon contains ten rows and 183 unique titles. It combines two different forms of curation:

- nine taste-informed discovery rows for films, television, documentary films and series, Indian cinema, global arthouse, comedy, and animation;
- one exact source-faithful row, `14 Iconic Indian Films — FHF`, whose membership follows the numbered Film Heritage Foundation program.

The taste-informed rows exclude every exact title in the known watched-series journal and explicit watchlist. They complement Watchly instead of replacing it. Watchly remains the dynamic engine that learns from new Simkl activity.

Import this manifest through AIOMetadata Custom Manifest Integration. AIOMetadata enriches the IMDb identifiers with posters and full metadata before the row reaches Stremio or Nuvio.

Every curated catalog must have a provenance entry in `curated/sources.json`. The validator rejects missing source records, malformed IMDb IDs, empty rows, type mismatches, and duplicate items.

Regenerate the taste-informed catalog payloads after an editorial change:

```powershell
node .\scripts\resolve-curated-seeds.mjs --write
node .\scripts\validate.mjs
```

The resolver accepts only exact title-and-year matches, documented alternate titles, or explicit IMDb overrides that resolve through Cinemeta.

See `RECOMMENDATION-ARCHITECTURE.md` for the Simkl, Watchly, AIOMetadata, MovieLens, and curated-layer design.

## Dynamic personal watchlist

Use Simkl **Plan to Watch** as the central dynamic watchlist. AIOMetadata can expose Simkl movie, series, and anime watchlists as Home catalogs without using a Trakt connection.

Generate a private CSV from the explicit watchlist in `private/taste-profile.json`:

```powershell
node .\scripts\build-simkl-watchlist.mjs
```

The output is `private/simkl-plan-to-watch-import.csv`. The `private/` directory is excluded from Git. Upload the CSV through Simkl's official CSV importer and select **Use .csv data**. Then connect Simkl in AIOMetadata and enable its Watchlist catalogs.
