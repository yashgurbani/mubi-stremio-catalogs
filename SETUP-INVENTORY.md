# Nuvio setup inventory

Nuvio is the active client. Stremio is legacy and is outside the maintenance scope. This document records the intended public addon configuration. It contains no credentials, tokens, or private manifest URLs.

## Playback policy

1. Use cached Real-Debrid streams first.
2. Rank 2160p before 1440p and 1080p.
3. Rank HDR10, HDR, and HLG before SDR.
4. Exclude Dolby Vision, HDR10+, combined HDR and Dolby Vision, and AV1.
5. Use release quality, expression score, language, subtitles, codec, age, bitrate, and seeders as tie-breakers.
6. Keep direct HTTP sources after Real-Debrid sources.
7. Keep Sootio as the final fallback.
8. Use manual stream selection in Nuvio.

The codec exclusions match the Philips 43PUS7363/12. The television supports HDR10, HLG, and HEVC Main10, but its manual does not list Dolby Vision, HDR10+, or AV1.

## Addon order

1. AIOMetadata — Simkl Watchlist & AI Search
2. Watchly
3. Curated Discovery — Film, TV & Docs
4. MUBI Editorial Collections — DE Snapshot
5. TMDB Discover+ — Festival Favourites
6. AIOMetadata (protected legacy catalogs)
7. OpenSubtitles v3
8. AIOStreams
9. TorrentIO
10. Cinemeta
11. Indian Regional Catalog
12. Stremify HTTP — Direct Fallback
13. Sootio HTTP

The live Nuvio Sync account matches this thirteen-addon order. The three Simkl watchlist rows lead the list. Watchly follows with personalized rows. Sootio remains last.

The protected AIOMetadata manifest still supplies live Netflix, canon, MUBI/BFI/Criterion, hidden-gem, and legacy watchlist rows. It also contains redundant search and discovery rows. Keep it below the focused addons until these distinct rows have replacements. Do not remove it only to reduce the addon count.

The public AIOStreams host does not collect TorrentIO, AnimeKitsu, torrent-catalog, P2P, or HTTP streams. TorrentIO now supplies the direct Real-Debrid fallback after AIOStreams.

A live Stranger Things S01E07 test returned 7 cached Real-Debrid streams from AIOStreams and 26 from TorrentIO. TorrentIO returned seven 4K choices. Neither provider returned Dolby Vision results.

## Recommendation architecture

### Immediate recommendations

Watchly supplies the primary personalized rows:

- Top Picks for You
- Because You Watched or Loved
- Genre and Keyword rows
- Favorite Creators
- Based on What You Loved
- Based on What You Liked

Watchly uses one history source per configuration. Use Simkl as the shared source when most playback occurs in Nuvio.

### Collaborative recommendations

MovieLens is a planned collaborative-filtering layer. AIOMetadata can import ratings from Simkl, Trakt, or MDBList into MovieLens when the server enables its MovieLens integration.

The public AIOMetadata endpoint does not expose whether its server-side MovieLens key exists. Keep Watchly with Simkl as the active recommendation system until MovieLens works through the configuration interface. A self-hosted AIOMetadata instance can enable MovieLens, but it needs `MOVIELENS_CRED_KEY` and stores an encrypted MovieLens password because MovieLens has no OAuth flow.

### Watchlists and explicit taste

- Letterboxd will supply ratings, history, and a personal watchlist after the public AIOMetadata instance includes the v2.16.3 URL-import repair.
- The central private taste profile stores Google watchlists and manual taste signals.
- MDBList supplies critic, award, and curator signals.
- Official MUBI collections supply source-faithful editorial rows.

### History flow

`Nuvio playback → Simkl scrobbling → Watchly profile → personalized homepage rows`

Planned: `Simkl ratings → AIOMetadata sync → MovieLens → collaborative recommendation rows`

This design avoids the Trakt free-account community-app limit. Couchmoney can keep the single Trakt community connection.

### Single-writer rule

Nuvio is the only service that writes playback progress to Simkl. Watchly reads Simkl history. AIOMetadata reads Simkl watchlists but must keep **Simkl Checkin** off. Simkl warns that multiple tracking integrations can cause scrobbling conflicts.

Use these roles:

- **Nuvio:** playback and Simkl scrobbling
- **Simkl:** shared history, ratings, and Plan to Watch
- **Watchly:** adaptive recommendation reader
- **AIOMetadata:** metadata and watchlist-catalog reader
- **MovieLens:** optional future collaborative-filtering reader

### Simkl activation

On Nuvio 0.8.11 or later:

1. Open **Settings → Tracking → Accounts**.
2. Select **Connect Simkl**.
3. Open the shown Simkl verification page and enter the activation code.
4. Open **Tracking → Sources**.
5. Select Simkl for **Watch Progress**.
6. Select Simkl for **Library** if the Simkl library must drive the Nuvio library.
7. Select **Sync now**.

Nuvio sends playback scrobbles to each connected tracking service. The selected source controls the Library and Continue Watching data that Nuvio reads.

In Watchly, connect the same Simkl account and select Simkl as the history source. Keep **Top Picks for You**, **Because You Watched or Loved**, **Genre and Keyword**, **Favorite Creators**, **Based on What You Loved**, and **Based on What You Liked** enabled.

## Subtitle policy

- Preferred subtitle language: English
- Secondary subtitle language: Hindi
- Keep **Show Only Preferred Languages** off so that manual fallback languages remain visible.
- Do not force only forced subtitles.
- Keep OpenSubtitles v3 installed and enabled.

Nuvio 0.8.11 automatically selects a matching embedded track before a matching addon track. It uses an addon subtitle when no matching embedded track exists. The app has no setting that always places OpenSubtitles before embedded tracks. Select an addon subtitle manually when its timing or text is better.

The live Nuvio TV settings have **Use Forced Subtitles** off. **Show Only Preferred Languages** also remains off.

## Nuvio playback compatibility

- Use **Dolby Vision Handling → HDR10 Base Layer** if a manually selected DV Profile 7 file reaches Nuvio.
- Keep **Strip HDR10+ Metadata** available for a manually selected HDR10+ stream.
- Keep the shared AIOStreams filters on HDR10, HDR, HLG, HEVC Main 10, and SDR.
- Keep Dolby Vision and HDR10+ excluded from automatic AIOStreams results because the Philips 43PUS7363/12 does not support these formats natively.

This policy preserves native HDR10 quality on the Philips 43PUS7363/12. It does not reduce compatible HDR10 files to SDR.

## Catalog policy

- Keep Watchly Top Picks near the top.
- Keep the dynamic personal watchlist near the top.
- Keep Indian and regional discovery.
- Keep Netflix discovery.
- Keep film and television canons.
- Keep documentary discovery.
- Keep animation mood rows.
- Keep MUBI Now Showing, BFI, and Criterion spotlight rows.
- Keep official MUBI thematic collections near the end of the homepage.
- Remove exact duplicate rows, but do not remove distinct discovery purposes.

The Indian Regional Catalog is a breadth and freshness source. A live first-page audit found no populated rating field across its 20 catalogs, one promotional item, and repeated titles across language and OTT rows. Keep selected raw regional rows late on Home. Use Watchly, festival, award, critic, archival, and language-aware quality rows earlier.

The private taste profile defines ten stable discovery lanes. These lanes cover relationship stories, diaspora and identity, systems and power, science, ensemble comedy, animation, Indian cinema, global arthouse, and documentaries. Watchly remains the dynamic personal engine. Its target discovery style is **Balanced**. Separate hidden-gem and editorial rows preserve serendipity.

The separate curated manifest now contains ten rows and 183 unique titles. Nine rows turn the private taste profile into film, television, documentary-film, documentary-series, Indian-cinema, arthouse, comedy, and animation shelves. The tenth row preserves the exact Film Heritage Foundation program `14 Iconic Indian Films — FHF`.

The curated rows contain no exact match from the known watched-series journal or explicit watchlist. Import the manifest through AIOMetadata so that its IMDb identifiers receive full posters and metadata. Keep the exact FHF row before raw regional latest-release catalogs.

The live Nuvio TV settings use **Classic View** and follow the installed addon order.

The live Watchly manifest contains 16 movie and series rows. It includes Top Picks, two current Because You Watched rows, six taste themes, creator rows, loved-title rows, and liked-title rows. Watchly now uses **Balanced** discovery with Simkl and Gemini.

The Nuvio Sync library contains two saved movies. It is not the requested central personal watchlist. Letterboxd remains a secondary movie-history and ratings source after the public AIOMetadata v2.16.3 deployment.

Simkl **Plan to Watch** is the preferred central watchlist. The public AIOMetadata instance exposes a built-in Simkl OAuth client. Simkl documents AIOMetadata as a free route for watchlist catalogs and check-in.

The focused AIOMetadata manifest exposes `Simkl Plan to Watch Movies`, `Simkl Plan to Watch Shows`, and `Simkl Plan to Watch Anime`. Simkl Checkin is off. The movie and anime rows are populated. The show row is empty until the user adds a show to Simkl Plan to Watch.

The protected AIOMetadata manifest retains a 41-item MDBList `Your Watchlist` row. Treat it as a secondary imported list. Simkl Plan to Watch is the central dynamic watchlist.

Normal movie, series, anime, collection, and people search endpoints return live results. A live movie query returned Past Lives, and a series query returned Dark. Gemini authentication succeeds, but the public AIOMetadata AI Search endpoint currently returns an empty result. The off-save-on-save repair did not change this result. Watchly still uses Gemini for its adaptive catalog names and Simkl-based recommendations. Do not describe AIOMetadata AI Search as operational until a live query returns titles.

## Update gates

- Keep the focused AIOMetadata configuration while the public instance remains on v2.16.2.
- Do not describe MovieLens as active until a real connection succeeds or the host documents the capability.
- Do not replace official MUBI collection membership with inferred titles.
- Do not save or publish private configuration URLs.
- Test an exact movie and series episode after stream configuration changes.
