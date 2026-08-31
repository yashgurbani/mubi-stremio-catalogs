# Nuvio remote-management procedure

Nuvio is the active client. Do not use Stremio account settings for this setup.

## Purpose

Nuvio TV includes a temporary local web manager. It can add, remove, and reorder addons. It can also enable, disable, and reorder Home catalogs. The television shows a QR code and a local network address while this manager is active.

Nuvio requires confirmation on the television before it applies a proposed change. This protects the addon list from unauthorized devices on the local network.

## Open the manager

1. Open **Nuvio → Settings → Addons** on the television.
2. Select **Manage from phone**.
3. Leave the QR-code screen open.
4. Open the shown address from a computer on the same network.

The page contains three sections in Advanced mode:

- **Addons:** add, remove, and reorder manifest URLs.
- **Home Layout:** enable, disable, rename, and reorder catalog rows.
- **Collections:** manage Nuvio collection groups.

## Apply a change

1. Edit the addon list or Home layout in the web manager.
2. Select **Save**.
3. Review the proposed additions, removals, and catalog changes on the television.
4. Select **Confirm** on the television.

Nuvio then stores the local state and pushes the addon list and Home-catalog settings to Nuvio Sync.

## Target addon order

1. Watchly
2. AIOMetadata, including Curated Discovery through Custom Manifest Integration
3. MUBI Editorial Collections
4. TMDB Discover+ — Festival Favourites
5. OpenSubtitles v3
6. AIOStreams
7. Cinemeta
8. Indian Regional Catalog
9. Stremify HTTP — Direct Fallback
10. Sootio HTTP

Remove addon packages whose only purpose is to expose hundreds of unrelated catalog rows. Keep stream fallbacks only when they add playback coverage.

## Target Home order

1. Continue Watching
2. Simkl Plan to Watch — Movies
3. Simkl Plan to Watch — Series
4. Simkl Plan to Watch — Anime
5. Watchly Top Picks — Movies
6. Watchly Top Picks — Series
7. Watchly Because You Watched — Movies
8. Watchly Because You Watched — Series
9. Watchly themes and creators
10. Curated Discovery — personal film and television rows
11. Documentary films and documentary series
12. Indian indie, regional, festival, and Film Heritage Foundation rows
13. MUBI Now Showing
14. BFI and Criterion spotlight
15. Exact MUBI thematic collections
16. Netflix New and Notable
17. Canon and hidden-gem rows
18. Comfort and adult-animation rows
19. Selected raw Indian regional rows
20. Direct-release and generic popularity rows

Disable duplicate Trending, Popular, Featured, and Upcoming rows. Preserve Watchly Top Picks. Keep broad regional indexes late on Home.

## Playback policy

- Keep automatic stream selection off.
- Keep cached Real-Debrid sources first.
- Keep native 2160p HDR10, HDR, HLG, and HEVC Main 10 enabled.
- Exclude Dolby Vision, HDR10+, combined HDR and Dolby Vision, and AV1 from the shared AIOStreams configuration.
- Keep direct HTTP sources and Sootio after Real-Debrid sources.
- Use OpenSubtitles v3 with English first and Hindi second.
- Keep forced-only subtitles off.
- Group subtitles by addon.
