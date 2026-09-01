# Live account completion audit — 31 August 2026

## Outcome

The live Nuvio account contains the intended addon stack and current Watchly recommendations. Nuvio is the active client. Stremio is legacy and is outside this audit.

1. The live AIOMetadata manifest does not contain Simkl Plan to Watch catalogs. Its `Your Watchlist` row is an MDBList catalog with 41 items.
2. The Nuvio web dashboard does not expose a row-by-row Home preview.
3. One AIOMetadata public-instance upgrade remains available upstream.

## Evidence scope

This review used the signed-in Nuvio Sync account, its synced TV settings, the live Watchly configuration, the Watchly manifest, and the live AIOMetadata manifest.

Private manifest URLs, account addresses, tokens, and configuration identifiers are not recorded in this file.

## Addon stack

The live Nuvio account contains eleven addons in this order:

1. Watchly
2. AIOMetadata
3. Curated Discovery — Film, TV & Docs
4. MUBI Editorial Collections — DE Snapshot
5. TMDB Discover+ — Festival Favourites
6. OpenSubtitles v3
7. AIOStreams
8. Cinemeta
9. Indian Regional Catalog
10. Stremify HTTP — Direct Fallback
11. Sootio HTTP

This order matches the intended architecture. Personalized catalogs lead, Real-Debrid aggregation remains central, and direct HTTP providers remain last.

## Watchly evidence

The loaded Watchly 1.13.1 manifest exposes 16 rows:

- Top Picks for You for movies and series
- Because You Watched for movies and series
- three movie taste themes
- three series taste themes
- favorite-creator rows for movies and series
- loved-title rows for movies and series
- liked-title rows for movies and series

The current Because You Watched seeds are *Memento* and *New Girl*. This result proves that Watchly has rebuilt its manifest from available taste data.

The live Watchly configuration identifies Simkl as the selected history source, Balanced as the discovery style, and Google Gemini as the AI provider. The manifest exposes the resulting rows but not the private history records.

The live AIOMetadata manifest exposes 39 catalogs. It contains Your Watchlist, Netflix, comfort and adult animation, documentary, Indian, hidden-gem, canon, MUBI, BFI/Criterion, AI Search, and title-search rows.

The `Your Watchlist` row is an MDBList catalog with 41 live items. The manifest contains no `simkl.watchlist.*` catalog. AIOMetadata source code confirms that it can add separate Simkl Plan to Watch rows for movies, shows, and anime. The saved configuration must be loaded before those rows can be added.

## Nuvio TV settings

### Correct values

- Auto Stream Selection: Manual
- Preferred audio: Original
- Subtitle language: English
- Secondary subtitle language: Hindi
- Show Only Preferred Languages: Off
- Prefer Binge Group: On
- Reuse Binge Group: On
- Continue Watching: On
- External-addon metadata: preferred
- Addon names and stream-size badges: visible

### Values saved

| Setting | Current | Target | Reason |
|---|---|---|---|
| Home Layout | Classic View | Classic View | Horizontal rows support the requested scrolling homepage. |
| Use Forced Subtitles | Off | Off | Normal English or Hindi subtitle tracks remain selectable. |
| Subtitle Organization | By addon | By addon | OpenSubtitles remains easy to identify when Nuvio lists an embedded track first. |
| Stream Selection Timeout | 15 seconds | 15 seconds | The client wait matches the configured AIOStreams collection limit. |
| Follow addon order | On | On | Nuvio arranges catalog rows from the installed addon order. |

The five changes are saved in Nuvio Sync. The television must refresh its account state before the new order appears.

## Collections

The Nuvio account contains 13 community collection groups. These include regional discovery, anime, awards, directors, studios, franchises, streaming services, and visual-film-study rows.

Most very large default groups are hidden from home. This is reasonable because some groups contain hundreds of folders and sources.

The requested endless homepage must come from Classic View and the ordered addon catalogs. It must not expose every folder from the massive default groups.

## Personal watchlist

The Nuvio Sync library currently contains two saved movies. This is not the complete personal watchlist requested in the original design.

Watchly reads Simkl history. AIOMetadata currently exposes a 41-item MDBList `Your Watchlist` row. It does not expose Simkl Plan to Watch rows.

The exact target rows are `Simkl Plan to Watch Movies`, `Simkl Plan to Watch Shows`, and `Simkl Plan to Watch Anime`. Keep Simkl Checkin off because Nuvio is the intended progress writer.

## Completion matrix

| Requirement | Status | Evidence or gap |
|---|---|---|
| Real-Debrid first | Confirmed | Live AIOStreams save and exact episode replay |
| Compatible 4K HDR first | Confirmed | Saved filters and Philips manual |
| Regional Indian coverage | Confirmed | Live Indian Regional Catalog addon |
| Personalized recommendations | Confirmed | Live 16-row Watchly manifest |
| MUBI editorial rows | Confirmed | Two current rows remain after the expired Wim Wenders source returned 404 |
| Nuvio scrolling homepage | Partially achieved | Classic View and addon-order following are saved; row preview needs a Nuvio client refresh |
| Normal English subtitles | Confirmed | English is preferred, Hindi is secondary, forced-only mode is off, and grouping is by addon |
| Dynamic complete watchlist | Not complete | The live AIOMetadata manifest has no Simkl watchlist catalogs; its current 41-item row is MDBList-backed |
| MovieLens collaborative filtering | Unverified | Public capability is not observable |

## Next safe action

Load the saved AIOMetadata configuration. Keep Simkl Checkin off. Add the movie, show, and anime Plan to Watch catalogs. Hide the legacy MDBList watchlist from Home after the three Simkl rows work.

After that save, add one direct Real-Debrid provider behind AIOStreams. This provider fills gaps caused by the public AIOStreams host policy. Keep HTTP-only addons after it.
