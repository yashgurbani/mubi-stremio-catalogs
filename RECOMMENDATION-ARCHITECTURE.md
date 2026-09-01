# Recommendation architecture

## Executive summary

The setup uses three recommendation layers instead of one opaque algorithm. Simkl stores shared history, ratings, and the personal watchlist. Watchly reads this history and produces adaptive rows. Curated Discovery supplies stable editorial rows for Indian cinema, documentaries, global arthouse, television, comedy, and animation.

The focused AIOMetadata addon now exposes separate Simkl Plan to Watch rows for movies, shows, and anime. Simkl Checkin remains off. The public Gemini AI Search endpoint returns an empty result although the key passes validation. Watchly recommendations do not depend on that endpoint.

Nuvio must remain the only service that writes playback progress to Simkl. AIOMetadata can read Simkl watchlists, but **Simkl Checkin must stay off**. This rule prevents duplicate or conflicting scrobbles.

MovieLens remains the best available collaborative-filtering extension. AIOMetadata can import Simkl ratings into MovieLens and expose MovieLens Top Picks. The public AIOMetadata host does not reveal whether its required credential-encryption key exists. Do not make MovieLens part of the live path until a real connection succeeds.

Overall confidence is high for the Watchly and Simkl design. Confidence is medium for MovieLens because public-host readiness is not observable without a connection test.

## Methodology

**Research period:** August 2026  
**Mode:** Verbose

The audit used official source code, release notes, product documentation, live manifests, and live catalog responses. It compared documented behavior with the deployed versions.

Queries included:

- `site:github.com/cedya77/aiometadata MovieLens 2.16.3 Simkl watchlist`
- `site:github.com/TimilsinaBimal/Watchly Simkl recommendation Balanced Everything profile`
- `site:simkl.com/apps/stremio AIOMetadata watchlist checkin`
- `site:github.com/NuvioMedia/NuvioTV Simkl lists sync issues`

Marketing and community commentary did not support architectural claims. Official repositories and Simkl documentation supplied the material evidence.

Known limitations:

- The public AIOMetadata configuration does not expose MovieLens server readiness.
- Watchly does not publish the exact weights for every ranking feature.
- Nuvio and Simkl can disagree temporarily about Continue Watching after unusual manual history edits.
- The Letterboxd URL-import repair exists in AIOMetadata v2.16.3, but the public host still reports v2.16.2.

## Verified data flow

```text
Nuvio playback
    ↓ one progress writer
Simkl history, ratings, and Plan to Watch
    ├──→ Watchly taste profile → adaptive Home rows
    ├──→ AIOMetadata watchlist catalogs → Your Watchlist rows
    └──→ future AIOMetadata rating import → MovieLens collaborative rows

Private taste profile + verified editorial sources
    ↓
Curated Discovery → stable Home rows
```

## Service roles

| Service | Role | Writes progress? | Main output |
|---|---|---:|---|
| Nuvio | Playback client and Simkl scrobbler | Yes | Watch activity |
| Simkl | Shared memory and watchlist | Stores writes | History, ratings, Plan to Watch |
| Watchly | Adaptive recommendation reader | No | Top Picks, Because You Watched, themes, creators |
| AIOMetadata | Metadata and catalog bridge | No | Simkl watchlists, metadata, future MovieLens rows |
| Curated Discovery | Stable editorial layer | No | Taste lanes, canon, regional and documentary rows |
| MovieLens | Optional collaborative filter | No | Similar-users recommendations |
| Gemini | Row-name helper | No | Clear names for dynamic Watchly themes |

Gemini does not rank the titles. Watchly uses a numerical profile and candidate scoring. MovieLens uses collaborative behavior. This separation keeps AI-generated text away from source-faithful memberships.

## Ranking policy

The homepage combines five signals:

1. Personal similarity from Watchly.
2. Explicit intent from Simkl Plan to Watch.
3. Collaborative evidence from MovieLens after activation.
4. Critic, festival, award, archival, and curator support.
5. Novelty and diversity across language, country, decade, genre, and popularity.

No single audience rating controls the final result. Ratings are useful diagnostics. They are weak evidence for low-vote regional, archival, restored, politically contested, and festival work.

## Discovery layers

### Adaptive layer

Watchly builds a profile from genres, keywords, directors, cast, eras, countries, runtime, ratings, loves, rewatches, and recent activity. **Balanced** is the target discovery style. It provides a stronger relevance boundary than Everything while separate rows preserve hidden gems.

Keep these Watchly rows near the top:

- Top Picks for You
- Because You Watched or Loved
- Genre and Keyword rows
- Favorite Creators
- Based on What You Loved
- Based on What You Liked

### Explicit-intent layer

Simkl **Plan to Watch** is the central watchlist. It can hold movies, series, and anime. AIOMetadata shows these lists as Home rows without consuming a Trakt community-app connection.

The initial private CSV contains 14 exact IMDb identifiers from the explicit movie watchlist. The uncertain companion-anime pair remains excluded until its identity is confirmed.

### Stable editorial layer

Curated Discovery v2.2.0 contains 10 rows and 183 unique titles. Nine rows use the recorded taste profile. One row preserves exact Film Heritage Foundation membership.

The stable layer solves three adaptive-system weaknesses:

- cold start after a new service connection;
- popularity bias against regional and arthouse cinema;
- overfitting to the most recent watch.

### Collaborative layer

AIOMetadata implements MovieLens Top Picks, recent recommendations, a watchlist, highest-rated titles, rated collections, and custom lists. It can import ratings from Simkl, Trakt, and MDBList.

MovieLens has no OAuth authorization flow in AIOMetadata. The host stores a MovieLens password in encrypted form and requires `MOVIELENS_CRED_KEY`. Use a unique MovieLens password if this layer becomes active.

Do not replace Watchly with MovieLens. Use MovieLens as an additional row after Watchly Top Picks. Collaborative filtering can find unexpected neighbors, but it has a cold-start problem and weaker television coverage.

## Deduplication policy

- Exclude exact watched titles from recommendation rows.
- Exclude exact Plan to Watch titles from recommendation rows.
- Allow a source-faithful list to contain a watchlist title only when exact source fidelity requires it.
- Keep one copy of generic Trending or Popular rows.
- Keep raw Indian regional rows late on Home as breadth indexes.
- Prefer adaptive, watchlist, critic, festival, and curated rows before raw release indexes.
- Preserve childhood comfort titles even when their audience rating is low.

Run these checks before deployment:

```powershell
node .\scripts\validate.mjs
node .\scripts\audit-personal-overlap.mjs --fail-on-overlap
node .\scripts\audit-curated-quality.mjs --local
```

## Single-writer rule

Simkl warns users to choose one tracking integration because multiple integrations can conflict. Nuvio already sends playback progress to Simkl. Therefore:

- keep Nuvio Simkl scrobbling on;
- keep AIOMetadata **Simkl Checkin** off;
- use AIOMetadata only for Simkl watchlist catalogs;
- use Watchly only as a Simkl history reader;
- do not add SyncriBullet while Nuvio scrobbling is active.

## Maintenance policy

Each monthly audit must:

1. Check the live Watchly manifest and its recommendation rows.
2. Check that Watchly still reads Simkl.
3. Check that Nuvio remains the only Simkl progress writer.
4. Check that AIOMetadata exposes Simkl watchlists with Checkin off.
5. Remove exact watched and watchlist overlaps from synthesized rows.
6. Check language, country, decade, genre, and popularity diversity.
7. Preserve exact source membership for MUBI and Film Heritage Foundation rows.
8. Revisit MovieLens only after public-host readiness is proven.

## Devil's advocate

A multi-layer homepage can still become noisy. Watchly can create several related rows from the same profile. Curated rows can become stale. Simkl history can also contain incomplete ratings, and Nuvio can lag after unusual manual edits.

The answer is not to collapse everything into one algorithm. Keep the high-value rows early, enforce cross-row deduplication, and refresh source-faithful rows on schedule. Treat MovieLens as optional until it adds real novelty.

## Evidence ledger

| Claim | Status | Evidence | Limitation |
|---|---|---|---|
| Watchly builds a numerical taste profile from Simkl history | Confirmed | Watchly README and source | Exact weights are not published |
| Watchly refreshes dynamic catalogs in the background | Confirmed | Watchly configuration reference | Public host scheduling can differ |
| AIOMetadata can expose Simkl watchlists | Confirmed | Simkl Stremio integration page and AIOMetadata source | Requires user OAuth |
| Multiple Simkl trackers can conflict | Confirmed | Simkl setup warning | Exact failure frequency is not published |
| AIOMetadata supports MovieLens recommendations | Confirmed | AIOMetadata UI and server source | Public-host readiness is unknown |
| AIOMetadata can import Simkl ratings into MovieLens | Confirmed | `movielensSync.ts` | Requires a connected MovieLens account |
| Nuvio Simkl Continue Watching has had edge-case bugs | Confirmed | Nuvio issue tracker | The reported issue is closed |

## Sources

- [Watchly README and architecture](https://github.com/TimilsinaBimal/Watchly/blob/main/README.md)
- [Simkl Stremio integrations](https://simkl.com/apps/stremio/)
- [AIOMetadata MovieLens interface](https://github.com/cedya77/aiometadata/blob/dev/configure/src/components/sections/MovieLensIntegration.tsx)
- [AIOMetadata MovieLens service](https://github.com/cedya77/aiometadata/blob/dev/addon/lib/movielens.ts)
- [AIOMetadata MovieLens rating sync](https://github.com/cedya77/aiometadata/blob/dev/addon/lib/movielensSync.ts)
- [AIOMetadata v2.16.3](https://github.com/cedya77/aiometadata/releases/tag/v2.16.3)
- [Nuvio 0.8.11-beta](https://github.com/NuvioMedia/NuvioTV/releases/tag/0.8.11-beta)
- [Nuvio Simkl Continue Watching issue](https://github.com/NuvioMedia/NuvioTV/issues/2732)

## Confidence and gaps

**Overall confidence:** High for the active Simkl, Watchly, Nuvio, and curated design. Medium for MovieLens activation.

The strongest evidence is official source code and live manifests. The weakest point is the public AIOMetadata host's unobservable MovieLens encryption setting. The next decisive test is a real MovieLens connection after the user creates an account with a unique password.
