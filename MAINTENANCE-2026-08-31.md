# Stremio maintenance report — 31 August 2026

## Outcome

The maintenance pass found one clear stream-order fault and two TV-compatibility faults.

- AIOStreams placed Stream Expressions before Resolution. This let some 1080p remuxes rank above 2160p releases.
- Dolby Vision and HDR10+ were preferred even though the Philips 43PUS7363/12 does not list those formats.
- AV1 was the first preferred video codec even though this TV does not list AV1 decoding.

The prepared AIOStreams configuration now uses this order:

1. Cached Real-Debrid streams
2. 2160p before 1080p
3. HDR10, HDR, and HLG before SDR
4. Release quality and Stream Expression score
5. Language, subtitles, codec, age, bitrate, and seeders as tie-breakers

The prepared filters exclude Dolby Vision, HDR10+, combined HDR and Dolby Vision, and AV1. MediaFusion is enabled. Sootio remains the final direct-HTTP fallback outside AIOStreams.

The AIOStreams changes still require the existing configuration UUID and password. They are not yet saved to the remote configuration.

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

- The AIOStreams public instance needs the private configuration password before it can save these changes.
- Sootio often omits codec and HDR metadata. Its labels cannot prove playback compatibility.
- MUBI availability is regional and can change between monthly snapshots.

## Evidence

### Stream reproduction

The AIOStreams endpoint returned seven cached Real-Debrid streams for the test episode. Two 1080p results appeared before two 2160p results. The active cached sort order was:

`SeaDex → Stream Expressions → Resolution → Quality → …`

The updated order is:

`SeaDex → Resolution → Visual Tag → Quality → Stream Expressions → …`

SeaDex is neutral for normal live-action releases. It remains first to preserve curated anime release selection.

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

MovieLens remains useful. AIOMetadata supports MovieLens recommendation catalogs and rating imports from supported tracking services. The monthly audit now checks the public version, Letterboxd import health, and MovieLens recommendation health before proposing an update.

Official sources:

- [AIOStreams v2.33.2](https://github.com/Viren070/AIOStreams/releases/tag/v2.33.2)
- [Tamtaro SEL configuration](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)
- [Nuvio 0.8.11-beta](https://github.com/NuvioMedia/NuvioTV/releases/tag/0.8.11-beta)
- [MediaFusion 6.1.5](https://github.com/mhdzumair/MediaFusion/releases/tag/6.1.5)
- [Sootio v1.9.1](https://github.com/sooti/sootio-stremio-addon/releases/tag/v1.9.1)
- [AIOMetadata v2.16.3](https://github.com/cedya77/aiometadata/releases/tag/v2.16.3)
- [AIOMetadata MovieLens configuration](https://github.com/cedya77/aiometadata/blob/dev/docs/ENVIRONMENT_VARIABLES.md)

## MUBI editorial refresh

The homepage addon now references three complete, current MUBI Germany collections:

- [AUSGEWÄHLT VON WIM WENDERS](https://mubi.com/de/de/collections/hand-picked-by-wim-wenders) — 4 currently available films
- [NEUE HORIZONTE: NEO-WESTERN](https://mubi.com/de/de/collections/new-frontiers) — 3 films
- [BEFORE BARBIE: GRETA GERWIG AND NOAH BAUMBACH](https://mubi.com/de/de/collections/greta-mumblecore) — 2 films

The old July files remain as an unlisted archive. The manifest no longer exposes those stale rows.

## Monthly maintenance automation

The active monthly audit now checks AIOMetadata release drift, Letterboxd import health, MovieLens recommendations, subtitle preferences, and one exact playback sample. It preserves the full homepage design, Indian and regional rows, Real-Debrid priority, and the Philips codec filters.

## Confidence and gaps

**Overall confidence:** High for the ranking fault, codec mismatch, and MUBI membership. Medium for long-term provider reliability.

The strongest evidence is the reproduced episode result, the live configuration, the TV manual, and official repository data. Sootio reliability remains uncertain because its result metadata is incomplete. The AIOMetadata upgrade is deferred until the public service reaches v2.16.3. The final AIOStreams result cannot be verified until the updated configuration is saved.
