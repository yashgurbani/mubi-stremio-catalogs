# MUBI Editorial Collections — Stremio Catalog Addon

This is a static, source-faithful Stremio catalog addon for three MUBI Germany editorial collections captured on 24 July 2026.

It contains:

- `We Have Always Been Here: Queer Cinema Looks Back` — 12 films
- `The Lure of the Image: Digital Worlds` — 7 films
- `Naked Ambition: Stephanie Rothman’s Exploitation Cinema` — 3 films

Every title is resolved to a specific TMDB ID. The addon does not generate, infer, expand, or deduplicate MUBI membership.

## Intended deployment

Publish this directory as a static HTTPS site whose root serves `manifest.json`. AIOMetadata can then import the manifest through **Custom Manifest Integration** and place the three catalogs at the end of Home.

GitHub Pages is sufficient because every collection contains fewer than 20 titles. No server, API key, database, Trakt connection, or MDBList slot is required.

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
4. Update the capture date in the manifest description and catalog IDs.
5. Retain at most three MUBI editorial rows on the Stremio homepage.

Do not publish empty collection shells or AI-invented “MUBI-style” memberships.
