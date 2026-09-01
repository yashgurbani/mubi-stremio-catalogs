# Nuvio maintenance report — 31 August 2026

## Outcome

The maintenance pass found one clear stream-order fault and two TV-compatibility faults.

- AIOStreams placed Stream Expressions before Resolution. This let some 1080p remuxes rank above 2160p releases.
- Dolby Vision and HDR10+ were preferred even though the Philips 43PUS7363/12 does not list those formats.
- AV1 was the first preferred video codec even though this TV does not list AV1 decoding.

The saved AIOStreams configuration now uses this order:

1. Cached Real-Debrid streams
2. 2160p before 1080p
3. HDR10, HDR, and HLG before SDR
4. Release quality and Stream Expression score
5. Language, subtitles, codec, age, bitrate, and seeders as tie-breakers

The active filters exclude Dolby Vision, HDR10+, combined HDR and Dolby Vision, and AV1. They keep HDR10, HDR, HLG, HEVC Main 10, and SDR. MediaFusion is enabled. Sootio remains the final direct-HTTP fallback outside AIOStreams.

AIOStreams now starts every enabled provider together. It returns after 40 results or 12 seconds. This removes indefinite loading without using the old four-second cutoff.

## Methodology

**Research period:** August 2026  
**Mode:** Standard, with a targeted live-system diagnosis

### Queries and checks

- Replayed the Stremio stream request for `Stranger Things S01E07`.
- Compared AIOStreams and Sootio results for resolution, cache state, source, and display metadata.
- Inspected the active AIOStreams sort order, codec filters, visual-tag filters, providers, and version.
- Checked official GitHub repositories and release pages for AIOStreams, Tamtaro, Nuvio, Sootio, and MediaFusion.
- Read the live MUBI Germany collection payloads for current names and available films.
- Resolved each new MUBI film to a specific TMDB movie ID.

### Filters

- Official repositories and live service payloads were primary sources.
- Community claims were not used to set codec support or MUBI membership.
- MUBI editorial descriptions were not treated as live catalog membership.

### Limitations

- Sootio often omits codec and HDR metadata. Its labels cannot prove playback compatibility.
- The Philips manual lists a 30 Mbit/s total-file bitrate and 20 Mbit/s video-bitrate limit for its multimedia player. Very large remuxes can still lag.
- MUBI availability is regional and can change between monthly snapshots.

## Evidence

### Stream reproduction

The AIOStreams endpoint returned seven cached Real-Debrid streams for the test episode. Two 1080p results appeared before two 2160p results. The active cached sort order was:

`SeaDex → Stream Expressions → Resolution → Quality → …`

The updated order is:

`SeaDex → Resolution → Visual Tag → Quality → Stream Expressions → …`

SeaDex is neutral for normal live-action releases. It remains first to preserve curated anime release selection.

After the save, a fresh request for `Stranger Things S01E07` returned only cached Real-Debrid results. A 2160p HEVC SDR result ranked first, followed by 1080p and 720p results. The live endpoint returned in less than one second because all available providers finished before the 12-second limit.

The official Philips manual confirms 2160p input, HDR10, Hybrid Log Gamma HDR, HEVC, and HEVC Main 10. It does not list Dolby Vision, HDR10+, or AV1.

### Current provider versions

| Component | Current evidence | Maintenance decision |
|---|---|---|
| AIOStreams | v2.33.2, released 11 August 2026 | Keep the current public instance. |
| Tamtaro Complete SEL | v3.2.0 in the official template repository | Use its device-exclusion and 4K-first concepts. Do not overwrite the customized configuration without review. |
| Nuvio | 0.8.11-beta, released 29 August 2026 | Keep manual stream selection and the saved subtitle preferences. |
| MediaFusion | 6.1.5, released 21 August 2026 | Enable it as another Real-Debrid source. |
| Sootio | v1.9.1, released 25 April 2026 | Keep it last because its result metadata is incomplete. |

### AIOMetadata update gate

The official stable AIOMetadata release is v2.16.3, published 30 August 2026. The public ElfHosted manifest still reports v2.16.2.

Do not reinstall the existing addon yet. Version 2.16.3 restores Letterboxd list and watchlist imports by URL. Waiting for the public instance to reach that version protects the current catalogs and recommendation setup.

MovieLens remains useful, but its public-instance status is unknown. AIOMetadata supports MovieLens catalogs and rating imports from supported tracking services. Its server needs `MOVIELENS_CRED_KEY` because MovieLens has no OAuth flow. The official code does not publish a MovieLens capability flag through `/api/config`. The monthly audit now reports this limit instead of treating a missing field as proof that MovieLens is disabled.

### Personalization data flow

Watchly v1.13.1 can build a taste profile from one selected history source: Stremio, Trakt, or Simkl. Its profile includes genres, keywords, directors, cast, eras, countries, and runtime preferences. Its dynamic catalogs refresh every 24 hours by default.

Nuvio 0.8.11 contains Simkl authentication, history, progress, and scrobbling components. Use Simkl as the shared history source for Nuvio playback:

`Nuvio playback → Simkl → Watchly → personalized homepage rows`

Keep Nuvio as the only Simkl progress writer. Watchly reads the account but does not need to scrobble. AIOMetadata can expose Simkl watchlist catalogs, but its **Simkl Checkin** option must remain off. Simkl warns that multiple tracking integrations can create scrobbling conflicts.

The same Simkl ratings can feed MovieLens through AIOMetadata when the host enables secure MovieLens credential storage:

`Simkl ratings → AIOMetadata → MovieLens → collaborative recommendation rows`

This planned path does not consume another Trakt community-app connection. Couchmoney can keep the existing Trakt connection.

Gemini improves AI-generated names for Watchly's dynamic rows. It does not replace Watchly's profile scorer or MovieLens collaborative filtering.

The Simkl import is now complete. The first pass accepted 29 of 36 entries. A retry with exact TMDB identifiers imported the remaining seven series. Watchly now uses Simkl as its history source and exposes six homepage catalog types, including Top Picks, Because You Watched, dynamic genre and keyword rows, favorite creators, loved titles, and liked titles.

Watchly is the active recommendation engine. It can use only one history source in each configuration. The Simkl connection gives Nuvio and Watchly a common history path. Watchly refreshes its dynamic catalogs every 24 hours by default.

### Nuvio subtitle and HDR behavior

Nuvio 0.8.11 reads the preferred and secondary subtitle languages from local app settings. It fetches subtitles from enabled addons and automatically enables a matching language.

The selection order does not satisfy the exact request to always prefer OpenSubtitles. Nuvio first selects a matching embedded track. It selects an addon subtitle as a fallback, or when an addon matches the primary language and an embedded track matches only the secondary language. The current settings screen has no addon-first switch.

Nuvio 0.8.11 also has a **Dolby Vision Handling** setting. Its **HDR10 Base Layer** mode ignores Dolby Vision enhancement data and plays the HEVC HDR10 base layer. This can recover some DV Profile 7 files on an HDR10-only display.

This conversion does not justify enabling Dolby Vision globally. The Philips television does not support Dolby Vision natively, and affected files caused black video. The AIOStreams filter therefore continues to exclude Dolby Vision. Native HDR10, HLG, and HEVC Main 10 remain enabled at full resolution.

Official sources:

- [Watchly source and personalization reference](https://github.com/TimilsinaBimal/Watchly)
- [AIOMetadata MovieLens integration](https://github.com/cedya77/aiometadata/blob/v2.16.3/docs/ENVIRONMENT_VARIABLES.md#movielens-integration)
- [Nuvio 0.8.11 source tree](https://github.com/NuvioMedia/NuvioTV/tree/0.8.11-beta/app/src/main/java/com/nuvio/tv/data/simkl)
- [Nuvio subtitle selection source](https://github.com/NuvioMedia/NuvioTV/blob/0.8.11-beta/app/src/main/java/com/nuvio/tv/ui/screens/player/PlayerRuntimeControllerTracks.kt)
- [Nuvio Dolby Vision handling source](https://github.com/NuvioMedia/NuvioTV/blob/0.8.11-beta/app/src/main/java/com/nuvio/tv/ui/screens/player/PlayerRuntimeControllerInitialization.kt)

Official sources:

- [AIOStreams v2.33.2](https://github.com/Viren070/AIOStreams/releases/tag/v2.33.2)
- [Tamtaro SEL configuration](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)
- [Nuvio 0.8.11-beta](https://github.com/NuvioMedia/NuvioTV/releases/tag/0.8.11-beta)
- [MediaFusion 6.1.5](https://github.com/mhdzumair/MediaFusion/releases/tag/6.1.5)
- [Sootio v1.9.1](https://github.com/sooti/sootio-stremio-addon/releases/tag/v1.9.1)
- [AIOMetadata v2.16.3](https://github.com/cedya77/aiometadata/releases/tag/v2.16.3)
- [AIOMetadata MovieLens configuration](https://github.com/cedya77/aiometadata/blob/dev/docs/ENVIRONMENT_VARIABLES.md)

## MUBI editorial refresh

The homepage addon now references two complete, current MUBI Germany collections:

- [NEUE HORIZONTE: NEO-WESTERN](https://mubi.com/de/de/collections/new-frontiers) — 3 films
- [BEFORE BARBIE: GRETA GERWIG AND NOAH BAUMBACH](https://mubi.com/de/de/collections/greta-mumblecore) — 2 films

On 1 September 2026, the official `AUSGEWÄHLT VON WIM WENDERS` page returned 404. Version 1.1.1 removes that expired row.

The old July files remain as an unlisted archive. The manifest no longer exposes those stale rows.

## Monthly maintenance automation

The active monthly audit now checks AIOMetadata release drift, Letterboxd import readiness, MovieLens evidence, subtitle behavior, and one exact playback sample. It marks MovieLens readiness unknown when the public service supplies no evidence.

The GitHub Pages workflow now uses the current major versions of the official checkout, Node setup, Pages configuration, artifact upload, and Pages deployment actions.

The repository now includes `scripts/audit-services.ps1`. This credential-free audit checks public service health, deployed versions, official releases, and every live MUBI catalog endpoint. Its first run found only one release drift: AIOMetadata 2.16.2 is deployed while 2.16.3 is current.

## Confidence and gaps

**Overall confidence:** High for the ranking fault, codec mismatch, live save, subtitle selection order, and MUBI membership. Medium for long-term provider reliability.

The strongest evidence is the reproduced episode result, the saved live configuration, the TV manual, and official repository data. Sootio reliability remains uncertain because its result metadata is incomplete. The AIOMetadata update is deferred until the public service reaches v2.16.3. MovieLens remains deferred until a real connection or host documentation proves readiness.

## Live account follow-up

The signed-in Nuvio Sync account contains the intended eleven-addon order. Its loaded Watchly manifest exposes 16 personalized movie and series rows.

The synced Nuvio TV settings now use Classic View. Forced-only subtitles are off. The stream timeout is 15 seconds, and catalog rows follow addon order.

See `LIVE-ACCOUNT-AUDIT-2026-08-31.md` for the requirement-by-requirement evidence and four staged Nuvio corrections.

## Catalog quality follow-up

The Indian Regional Catalog remains useful for broad language and release coverage, but its raw ordering is not a quality ranking. A new credential-free audit samples all 20 catalogs and reports missing rating metadata, duplicates, promotional entries, identifier quality, and recency concentration.

The first audit found zero populated rating fields in every first-page sample. It also found one promotional item and four repeated titles across sampled rows. Keep selected regional rows late on Home. Place personal, critic, festival, award, archival, and source-faithful rows earlier.

The private taste profile contains ten curated discovery lanes for films, series, documentaries, Indian cinema, global arthouse, and animation. Watchly remains the active dynamic engine. Its live discovery style is **Balanced**.

The public curated addon now implements nine taste-informed shelves, one visual film-education shelf, and the exact Film Heritage Foundation shelf. It contains 210 unique titles. A local comparison found no exact overlap with the known watched-series journal or explicit watchlist.

Simkl **Plan to Watch** is the selected dynamic watchlist. The import is complete, but the live AIOMetadata manifest still has only a 41-item MDBList watchlist. Add the separate Simkl movie, show, and anime Plan to Watch catalogs after the protected configuration is loaded.

See `CATALOG-QUALITY-AUDIT-2026-08-31.md` for the evidence ledger and target homepage order.

## 1 September live verification

The private AIOStreams manifest remains healthy on version 2.33.2. A request for *Dune: Part Two* returned cached Real-Debrid 2160p HDR streams first.

*Stranger Things* S01E07 returned eight cached Real-Debrid streams. Four were 2160p, but the current provider set exposed no HDR copy for that episode.

The ElfHosted public AIOStreams instance disables Torrentio, AnimeKitsu, torrent catalogs, P2P, and HTTP at the host level. The active AIOStreams results therefore depend on Real-Debrid Library, Meteor, MediaFusion, and other host-enabled sources.

This host policy explains some missing-provider cases. A direct Real-Debrid provider can fill the gap without changing the HDR10 or codec policy.
