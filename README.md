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

The AIOMetadata gate now reports two capabilities separately:

- whether the public version contains the Letterboxd URL-import repair from v2.16.3;
- whether MovieLens readiness is observable from the public service.

AIOMetadata does not publish its server-side MovieLens key through `/api/config`. The audit therefore reports MovieLens as `unknown`, not disabled. Use `-FailOnDrift` when release drift must return a nonzero exit code.

The full evidence ledger and maintenance decisions are in [DEEP-RESEARCH-2026-08-31.md](DEEP-RESEARCH-2026-08-31.md).

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
