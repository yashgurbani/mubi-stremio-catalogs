# Stremio and Nuvio deep-research audit — 31 August 2026

## Executive conclusion

The current system has a sound core. Cached Real-Debrid streams rank first, compatible 4K HDR ranks before lower resolutions, and Simkl now feeds Watchly.

No safe reinstall or catalog replacement is due today. AIOMetadata v2.16.3 exists upstream, but the public instance still reports v2.16.2. MovieLens readiness cannot be observed through the public configuration endpoint.

The main unresolved product gap is subtitle precedence. Nuvio can auto-enable English subtitles, but it cannot always prefer OpenSubtitles over a matching embedded track.

## Research question

This audit examined five questions:

1. Does the active setup preserve the best compatible 4K HDR quality for the Philips 43PUS7363/12?
2. Does Real-Debrid remain the primary stream path?
3. Does the personalized recommendation path use the imported history?
4. Are Letterboxd and MovieLens ready for a safe AIOMetadata update?
5. Are the MUBI collections current and source-faithful?

## Method

The audit used live manifests, service health endpoints, official release pages, tagged source code, and the Philips manual. It did not use community codec claims or inferred MUBI memberships.

The main queries and checks were:

- compare deployed versions with the latest official GitHub releases;
- inspect the public AIOMetadata configuration schema for a MovieLens capability;
- inspect AIOMetadata v2.16.3 release notes and environment-variable documentation;
- inspect Watchly's source documentation for data sources, catalog types, and refresh timing;
- inspect Nuvio 0.8.11-beta subtitle and Dolby Vision code paths;
- request each published MUBI catalog endpoint and validate every TMDB item;
- compare the published MUBI rows with the official Germany collection pages;
- replay one exact series episode through the saved AIOStreams configuration.

## Evidence ledger

| Finding | Status | Evidence | Decision |
|---|---|---|---|
| Cached Real-Debrid ranks first | Confirmed | Saved AIOStreams configuration and live episode replay | Keep |
| Native HDR10 and HLG remain available | Confirmed | Active visual-tag filters and Philips manual | Keep |
| Dolby Vision is not a native TV format | Confirmed | Philips manual lists HDR10 and HLG, but not Dolby Vision | Exclude in shared configuration |
| Nuvio can recover some DV7 files as HDR10 | Confirmed | Tagged Nuvio 0.8.11-beta source | Use only as a manual Nuvio fallback |
| Watchly uses Simkl and refreshes daily | Confirmed | Saved Watchly configuration and official source documentation | Keep as active recommendation engine |
| Letterboxd URL import is ready upstream | Confirmed | AIOMetadata v2.16.3 release notes | Wait for public deployment |
| MovieLens is active on the public instance | Unknown | The official public configuration schema has no capability flag | Require a real connection test or host documentation |
| MUBI rows use exact source membership | Confirmed | Official collection pages and validated catalog payloads | Keep |
| Nuvio always prefers OpenSubtitles | Refuted | Tagged subtitle-selection source chooses a matching embedded track first | Use manual selection when needed |

## Playback findings

The Philips television supports 2160p input, HDR10, HLG, HEVC, and HEVC Main 10. The current AIOStreams filters retain these formats.

The active ranking does not reduce HDR10 to SDR. It ranks HDR10, HDR, and HLG before SDR after resolution and Real-Debrid cache state.

Dolby Vision and HDR10+ remain excluded. This choice prevents black video in Stremio and other clients that lack Nuvio's conversion path.

Nuvio 0.8.11-beta adds useful recovery controls. **HDR10 Base Layer** can remove Dolby Vision enhancement data from DV Profile 7. **Strip HDR10+ Metadata** can remove unsupported dynamic metadata.

These controls apply inside Nuvio. They do not change Stremio playback. A shared AIOStreams configuration must remain compatible with both clients.

## Recommendation findings

Watchly with Simkl is the active personalized system. Simkl holds the imported history and receives Nuvio progress. Watchly then builds Top Picks, Because You Watched, genre, keyword, creator, loved-title, and liked-title rows.

Watchly uses one source in each configuration. The selected Simkl source is therefore the correct choice for a Nuvio-first household.

MovieLens remains valuable for collaborative filtering. However, AIOMetadata needs a server-side `MOVIELENS_CRED_KEY`. MovieLens lacks OAuth, so the server encrypts and stores the MovieLens password.

The public AIOMetadata configuration schema does not expose MovieLens readiness. A missing field does not prove that the integration is disabled. A public version update alone will not prove that the server-side key exists.

Self-hosting can enable MovieLens now. That option adds an always-on service, updates, backups, and credential custody. The expected recommendation benefit does not yet justify that maintenance burden.

## Letterboxd finding

AIOMetadata v2.16.3 restores Letterboxd list and watchlist imports by URL. The public ElfHosted manifest still reports v2.16.2.

Keep the existing AIOMetadata installation until the public instance reaches v2.16.3 or later. Then inspect the live configuration page before reinstalling.

## Subtitle finding

Set **Preferred Language** to English and **Secondary Preferred Language** to Hindi in Nuvio. Keep **Use Forced Subtitles** off unless forced-dialog tracks are the goal.

Keep **Show Only Preferred Languages** off. This retains manual access to other languages when English and Hindi do not match.

Nuvio currently selects an embedded primary-language track before an addon primary-language track. It chooses the addon when no embedded match exists.

Therefore, the exact policy “always auto-select OpenSubtitles, never embedded” is not available in Nuvio 0.8.11-beta. The practical fallback is manual addon selection.

## MUBI finding

The published addon exposes three current Germany editorial collections. Each row uses an official collection name and exact TMDB identifiers.

The official editorial text can mention films that are not currently available in Germany. The addon correctly excludes those essay references unless the live collection payload shows availability.

The official Now Showing page remains dynamic and separate. The static thematic rows do not duplicate or replace that daily page.

## Devil's advocate

The strongest case for self-hosting AIOMetadata is immediate MovieLens access. It can add true collaborative filtering without another Trakt community-app connection.

The case against it is stronger today. Watchly already has a complete Simkl history path, the public MovieLens capability is absent, and self-hosting adds credential and uptime duties.

The lowest-risk decision is to wait. Revisit self-hosting only if Watchly recommendations remain weak after two full daily refreshes and more Nuvio scrobbles.

## Safe next actions

1. Keep watching through Nuvio with Simkl scrobbling enabled.
2. Allow two Watchly refresh cycles after the completed Simkl import.
3. Use manual addon subtitle selection when an embedded track appears first.
4. Keep the monthly audit active.
5. Reinstall AIOMetadata only after both public capability gates pass.

## Confidence and gaps

Confidence is high for codec support, stream ranking, Nuvio subtitle order, AIOMetadata version state, and published MUBI payload validity.

Confidence is medium for long-term provider reliability. Provider response times and cached torrent availability change by title and time.

MovieLens readiness remains unknown because the service publishes no capability flag. A real account connection or explicit host documentation can resolve this gap.

The browser could not expose Nuvio's TV-local settings. Tagged source code establishes the available controls and behavior, but not the current values on the television.

## Primary sources

- [Philips 43PUS7363/12 user manual](https://www.documents.philips.com/assets/20230308/9b2058790b984d52ab19afbf01018a9d.pdf)
- [Nuvio 0.8.11-beta release](https://github.com/NuvioMedia/NuvioTV/releases/tag/0.8.11-beta)
- [Nuvio subtitle selection source](https://github.com/NuvioMedia/NuvioTV/blob/0.8.11-beta/app/src/main/java/com/nuvio/tv/ui/screens/player/PlayerRuntimeControllerTracks.kt)
- [Nuvio Dolby Vision source](https://github.com/NuvioMedia/NuvioTV/blob/0.8.11-beta/app/src/main/java/com/nuvio/tv/ui/screens/player/PlayerRuntimeControllerInitialization.kt)
- [Watchly source and architecture](https://github.com/TimilsinaBimal/Watchly)
- [AIOMetadata v2.16.3 release](https://github.com/cedya77/aiometadata/releases/tag/v2.16.3)
- [AIOMetadata MovieLens configuration](https://github.com/cedya77/aiometadata/blob/v2.16.3/docs/ENVIRONMENT_VARIABLES.md#movielens-integration)
- [MUBI Germany Now Showing](https://mubi.com/de/de/showing)
- [MUBI: AUSGEWÄHLT VON WIM WENDERS](https://mubi.com/de/de/collections/hand-picked-by-wim-wenders)
- [MUBI: NEUE HORIZONTE: NEO-WESTERN](https://mubi.com/de/de/collections/new-frontiers)
- [MUBI: BEFORE BARBIE: GRETA GERWIG AND NOAH BAUMBACH](https://mubi.com/de/de/collections/greta-mumblecore)
