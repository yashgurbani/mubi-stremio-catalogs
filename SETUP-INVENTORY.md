# Stremio and Nuvio setup inventory

This document records the intended public configuration. It contains no credentials, tokens, or private manifest URLs.

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

1. Watchly
2. AIOMetadata
3. Festival Favourites
4. OpenSubtitles v3
5. AIOStreams
6. Cinemeta
7. Indian Regional Catalog
8. Stremify HTTP — Direct Fallback
9. Sootio HTTP

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

AIOMetadata connects a MovieLens account. MovieLens supplies collaborative filtering. AIOMetadata can import ratings from Simkl, Trakt, or MDBList into MovieLens.

### Watchlists and explicit taste

- Letterboxd supplies ratings, history, and a personal watchlist.
- The central private taste profile stores Google watchlists and manual taste signals.
- MDBList supplies critic, award, and curator signals.
- Official MUBI collections supply source-faithful editorial rows.

### History flow

`Nuvio playback → Simkl scrobbling → Watchly profile → personalized homepage rows`

`Simkl ratings → AIOMetadata sync → MovieLens → collaborative recommendation rows`

This design avoids the Trakt free-account community-app limit. Couchmoney can keep the single Trakt community connection.

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
- Prefer OpenSubtitles results.
- Do not force only forced subtitles.
- Do not prefer embedded subtitles over OpenSubtitles.

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

## Update gates

- Do not reinstall AIOMetadata until the public instance reaches v2.16.3 or later.
- Do not replace official MUBI collection membership with inferred titles.
- Do not save or publish private configuration URLs.
- Test an exact movie and series episode after stream configuration changes.
