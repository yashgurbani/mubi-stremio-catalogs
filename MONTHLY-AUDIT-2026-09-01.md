# Nuvio monthly maintenance audit — 1 September 2026

## Outcome

No catalog or playback change was necessary. The public services and source-faithful catalogs remain healthy.

## Live checks

- AIOStreams is healthy at 2.33.2.
- AIOMetadata is healthy at 2.16.2. The public host has not deployed 2.16.3.
- Watchly is healthy at 1.13.1 and exposes 16 personalized catalogs.
- Watchly still uses the Balanced discovery mode. Top Picks and Because You Watched remain live.
- Curated Discovery is healthy at 2.2.1. All 11 catalogs and 210 titles resolve.
- The curated rows have complete rating and genre metadata. No title is unresolved.
- The known watched journal and explicit watchlist have no exact overlap with Curated Discovery.
- The focused AIOMetadata manifest exposes all three Simkl Plan to Watch catalogs.
- Simkl contains 25 planned movies, no planned shows, and 2 planned anime titles.
- The protected AIOMetadata manifest still contains duplicate and legacy Home rows. Keep it installed for its distinct Netflix, MUBI, BFI, Criterion, canon, and hidden-gem coverage. Hide its redundant rows in Nuvio Home Layout.

## MUBI source audit

The two public source-faithful MUBI collections remain available under the same official names:

- `NEUE HORIZONTE: NEO-WESTERN`
- `BEFORE BARBIE: GRETA GERWIG AND NOAH BAUMBACH`

No membership change was applied. The repository snapshot remains exact to the verified regional source pages used on 31 August 2026.

## Regional catalog audit

All 20 raw Indian Regional Catalog rows still lack rating metadata. The samples also contain synthetic identifiers, one promotional entry, and cross-catalog duplicates. Keep this addon as a late Home or Discover breadth source. Keep the curated Indian cinema and Film Heritage Foundation rows earlier.

## Playback policy

No playback setting changed during this audit. Keep the last verified Nuvio policy:

1. Use manual stream selection.
2. Put cached Real-Debrid sources first.
3. Put AIOStreams before TorrentIO.
4. Put direct HTTP sources after both Real-Debrid providers.
5. Keep Sootio last.
6. Prefer compatible 2160p HDR10, HDR, HLG, and HEVC Main 10.
7. Exclude Dolby Vision, HDR10+, combined HDR and Dolby Vision, and AV1 from automatic results.
8. Use English subtitles first and Hindi second. Keep forced-only subtitles off.

No stream test was necessary because this audit did not change playback settings.

## Deferred items

- Wait for the public AIOMetadata host to deploy 2.16.3 before any reinstall or Letterboxd URL-import retry.
- MovieLens capability remains unobservable on the public host.
- The signed-in Nuvio web account does not expose per-catalog Home ordering. Apply the documented row order in the TV Home Layout manager.
