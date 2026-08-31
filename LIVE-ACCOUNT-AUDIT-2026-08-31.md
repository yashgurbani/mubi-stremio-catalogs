# Live account completion audit — 31 August 2026

## Outcome

The live Nuvio account contains the intended addon stack and current Watchly recommendations. Nuvio is the active client. Stremio is legacy and is outside this audit.

1. Nuvio uses Modern View instead of the requested scrolling homepage.
2. Forced subtitles are on, which can suppress normal English subtitles.
3. The complete Simkl Plan to Watch catalogs are not yet verified on the Nuvio homepage.

## Evidence scope

This review used the signed-in Nuvio Sync account, its synced TV settings, and the loaded Watchly manifest.

Private manifest URLs, account addresses, tokens, and configuration identifiers are not recorded in this file.

## Addon stack

The live Nuvio account contains nine addons in this order:

1. Watchly
2. AIOMetadata
3. TMDB Discover+ — Festival Favourites
4. OpenSubtitles v3
5. AIOStreams
6. Cinemeta
7. Indian Regional Catalog
8. Stremify HTTP — Direct Fallback
9. Sootio HTTP

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

The manifest does not expose which history provider supplied that data. The prior saved configuration identifies Simkl as the selected source.

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

### Values that need correction

| Setting | Current | Target | Reason |
|---|---|---|---|
| Home Layout | Modern View | Classic View | Modern View uses one active row. Classic View restores the requested vertical catalog home. |
| Use Forced Subtitles | On | Off | The current mode selects nothing when no forced track exists. |
| Subtitle Organization | None | By addon | Grouping by addon makes OpenSubtitles easier to select when Nuvio prefers an embedded track. |
| Stream Selection Timeout | 30 seconds | 15 seconds | AIOStreams already stops provider collection at 12 seconds. The shorter client wait removes avoidable loading time. |

The four changes are reversible. They require one Nuvio settings save and a TV sync.

## Collections

The Nuvio account contains 13 community collection groups. These include regional discovery, anime, awards, directors, studios, franchises, streaming services, and visual-film-study rows.

Most very large default groups are hidden from home. This is reasonable because some groups contain hundreds of folders and sources.

The requested endless homepage must come from Classic View and the ordered addon catalogs. It must not expose every folder from the massive default groups.

## Personal watchlist

The Nuvio Sync library currently contains two saved movies. This is not the complete personal watchlist requested in the original design.

The central dynamic watchlist now uses Simkl **Plan to Watch**. AIOMetadata can expose separate movie, series, and anime watchlist rows. Letterboxd remains a secondary source for movie ratings and history after the public v2.16.3 deployment.

## Completion matrix

| Requirement | Status | Evidence or gap |
|---|---|---|
| Real-Debrid first | Confirmed | Live AIOStreams save and exact episode replay |
| Compatible 4K HDR first | Confirmed | Saved filters and Philips manual |
| Regional Indian coverage | Confirmed | Live Indian Regional Catalog addon |
| Personalized recommendations | Confirmed | Live 16-row Watchly manifest |
| MUBI editorial rows | Confirmed | Validated source-faithful catalog addon |
| Nuvio scrolling homepage | Not achieved | Modern View is active |
| Normal English subtitles | Partially achieved | English is preferred, but forced-only mode is active |
| Dynamic complete watchlist | Not achieved | Nuvio library has two items and Letterboxd import is blocked |
| MovieLens collaborative filtering | Unverified | Public capability is not observable |

## Next safe action

Use Nuvio's **Manage from phone** web manager to update addons and Home-catalog order. Then save the four Nuvio TV settings changes, sync the television, and inspect the new homepage and subtitle behavior.
