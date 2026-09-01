# Nuvio completion audit — 1 September 2026

## Outcome

Nuvio is the only active client. The live account now uses a layered homepage, Simkl memory, Watchly recommendations, focused watchlist rows, curated discovery, exact MUBI collections, regional breadth, and Real-Debrid-first playback.

One live gap remains:

1. The public AIOMetadata AI Search endpoint returns no titles although the Gemini key passes validation.

## Live homepage order

1. AIOMetadata — Simkl Watchlist & AI Search
2. Watchly
3. Curated Discovery — Film, TV & Docs
4. MUBI Editorial Collections — DE Snapshot
5. TMDB Discover+ — Festival Favourites
6. AIOMetadata protected legacy catalogs
7. OpenSubtitles v3
8. AIOStreams
9. TorrentIO
10. Cinemeta
11. Indian Regional Catalog
12. Stremify HTTP — Direct Fallback
13. Sootio HTTP

The focused AIOMetadata addon contains three Simkl Plan to Watch rows. It also contains movie, series, anime, collection, people, and AI search catalogs. Simkl Checkin is off.

The live Simkl rows contain 25 movies, no shows, and 2 anime titles. The empty show row is valid because Simkl Plan to Watch has no planned show yet. Imported viewing history does not populate Plan to Watch.

The protected AIOMetadata addon remains because it supplies live Netflix, canon, MUBI/BFI/Criterion, hidden-gem, and legacy watchlist rows. All 28 non-search homepage endpoints returned HTTP 200 during this audit. Removing this addon now would reduce coverage.

## Recommendation and memory layers

| Layer | Live status | Purpose |
|---|---|---|
| Simkl | Active | Shared history, ratings, and Plan to Watch |
| Watchly | Active | Top Picks, Because You Watched, taste themes, creators, loved and liked titles |
| Curated Discovery v2.2.0 | Active | Indian cinema, documentaries, global arthouse, television, comedy, and animation |
| MUBI exact snapshot | Active | Two verified official thematic collections |
| Film Heritage Foundation | Active | Exact 14-film source list |
| MovieLens | Not active | Optional collaborative filter after public-host support is proven |

The live Watchly manifest has 16 rows. Watchly reads Simkl, uses Balanced discovery, and retains Top Picks and Because You Watched.

The curated addon has 10 rows and 183 unique titles. Every title resolves. The known watched-series journal and explicit watchlist have zero exact overlap with these rows.

## Playback and subtitle policy

- Cached Real-Debrid streams rank first.
- 2160p ranks before 1080p.
- HDR10, HDR, and HLG rank before SDR.
- Dolby Vision, HDR10+, combined HDR and Dolby Vision, and AV1 remain excluded.
- Direct HTTP sources follow Real-Debrid sources.
- Sootio remains the last manual fallback.
- Nuvio uses manual stream selection and a 15-second timeout.
- English subtitles are primary. Hindi subtitles are secondary.
- Forced-only subtitles are off.

This policy keeps the best compatible quality for the Philips 43PUS7363/12. The television supports HDR10, HLG, HEVC, and HEVC Main10.

OpenSubtitles v3 is installed before the stream addons. Nuvio can still select a matching embedded subtitle before an addon subtitle. The current client has no global addon-first subtitle switch.

## Source and quality audit

- AIOStreams 2.33.2 is healthy.
- TorrentIO is installed directly after AIOStreams and uses Real-Debrid.
- Stranger Things S01E07 returned 26 cached TorrentIO results, including seven 4K choices and no Dolby Vision results.
- Dune: Part Two returned 56 cached TorrentIO results, including 26 4K and 17 HDR choices. No Dolby Vision result appeared.
- AIOMetadata 2.16.2 is healthy. Version 2.16.3 remains undeployed on the public host.
- Watchly 1.13.1 is healthy.
- MUBI snapshot 1.1.1 is healthy.
- Curated Discovery 2.2.0 is healthy.
- Both exact MUBI rows return every expected title.
- The expired Wim Wenders MUBI row is absent.
- The Indian Regional Catalog remains a late-home breadth source because its raw rows contain no rating metadata.

## Requirement matrix

| Requirement | Status | Evidence or limit |
|---|---|---|
| Nuvio-only active setup | Complete | Live account and maintenance policy |
| Simkl history and central watchlist | Complete | Three focused Plan to Watch catalogs and Nuvio single-writer rule |
| Personalized recommendations | Complete | Watchly 16-row live manifest |
| Because You Watched | Complete | Watchly dynamic rows |
| Taste-aware curated discovery | Complete | 10 rows, 183 unique titles, zero known personal overlap |
| Hindi and regional breadth | Complete | Curated Indian row plus late raw regional addon |
| Documentary, arthouse, canon, and film-study discovery | Complete | Curated and protected catalog rows |
| Netflix discovery | Complete | Protected AIOMetadata rows remain live |
| Exact current MUBI thematic collections | Complete | Two verified live rows and one expired row removed |
| MUBI/BFI/Criterion coverage | Complete with legacy dependency | Protected dynamic rows plus focused exact MUBI rows |
| Compatible 4K HDR ranking | Complete | AIOStreams policy and live movie/episode samples |
| Direct Real-Debrid provider redundancy | Complete | TorrentIO is installed after AIOStreams and returned cached 4K streams |
| Gemini AI search | Upstream problem | The off-save-on-save repair completed, but the public endpoint still returned HTTP 200 with an empty list |
| MovieLens collaborative filtering | Deferred | Public-host capability is not proven and no MovieLens account is connected |

## Monthly maintenance

The active monthly automation targets Nuvio. It audits source-faithful MUBI membership, curated quality, Simkl roles, Watchly rows, addon order, playback compatibility, and live manifests. It does not maintain Stremio.
