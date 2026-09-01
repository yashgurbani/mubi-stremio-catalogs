# Taste-signal integration audit — 1 September 2026

## Executive summary

The private taste profile now preserves the main signals from this setup thread. Google watchlists, the YouTube cinema playlist, and the Instagram cinema collection are normalized. Simkl contains the imported film and television history. Watchly reads Simkl and now uses Balanced discovery.

Two sources remain incomplete. Letterboxd is not signed in in the active Chrome session. The IFFMH page does not preserve the earlier highlighted subset, so the exact watched-and-loved titles cannot be reconstructed safely.

The live AIOMetadata manifest still lacks Simkl Plan to Watch rows. Its current `Your Watchlist` row is a 41-item MDBList catalog. Add separate Simkl movie, show, and anime rows after the protected configuration is loaded.

**Overall confidence:** High for the normalized Google, YouTube, Instagram, Simkl, Watchly, and curated-addon evidence. Low for the missing IFFMH subset.

## Methodology

**Research period:** August and September 2026  
**Mode:** Verbose, targeted account audit

### Queries and live checks

- Read both signed-in Google Saved watchlist pages.
- Read the private YouTube cinema playlist and its 26 visible items.
- Read the signed-in Instagram saved cinema collection and its 12 visible posts.
- Read the public IFFMH 2025 archive page.
- Opened Letterboxd and checked the active sign-in state.
- Read the live Watchly and AIOMetadata manifests.
- Read AIOMetadata's Simkl integration source.
- Ran the local curated-quality and personal-overlap audits.

### Filters applied

- Saved posts and video essays are taste evidence, not automatic watched items.
- Obvious accidental or unrelated YouTube saves receive low weight.
- Exact watchlist titles remain distinct from inferred taste topics.
- Festival and editorial memberships remain source-faithful.
- Private title-level exports stay outside Git.

### Known limitations before synthesis

- Two unavailable YouTube videos remain unknown.
- Letterboxd needs a new sign-in before its history and watchlist can be read.
- The earlier IFFMH highlights are not present on the current archive page.
- The Nuvio web dashboard does not show a row-by-row Home preview.

## Integrated sources

| Source | Live evidence | Status | Use |
|---|---|---|---|
| Manual film watchlist | 15 recorded entries | Integrated | Explicit intent and taste seeds |
| Watched television journal | 20 series | Integrated into Simkl | History and recommendation memory |
| Simkl import | 36 accepted titles | Integrated | Shared history and ratings layer |
| Google Search Watchlist | 25 visible items | Normalized | Exact watchlist baseline |
| Google TV Watchlist | 19 visible items | Normalized | Confirmed subset of the Search Watchlist |
| YouTube cinema playlist | 26 visible items, 2 unavailable | Normalized | Weighted craft, theme, and topic evidence |
| Instagram cinema collection | 12 visible saved posts | Normalized | High-weight film and craft taste evidence |
| Watchly | 16 live catalog rows | Active | Adaptive recommendations from Simkl |
| Curated Discovery 2.2.1 | 11 rows, 210 unique titles | Active | Stable editorial breadth plus visual film education |
| Letterboxd | Signed-out page | Pending | Film ratings, history, and watchlist |
| IFFMH 2025 highlights | Archive page available, highlights missing | Pending exact titles | Watched-and-loved festival evidence |

## Normalized taste interpretation

The combined signals support these stable preferences:

- Character-led stories about intimacy, memory, identity, and loss.
- Indian independent and regional cinema across Hindi, Tamil, Malayalam, and other languages.
- Global arthouse cinema, especially Iranian, East Asian, and European work.
- Filmmaking craft, cinematography, screenwriting, and formally precise direction.
- Science, artificial intelligence, engineering, and space documentaries.
- Smart ensemble comedy and relationship-focused television.
- Dark adult animation and childhood comfort animation.
- Humanistic stories about children, family, responsibility, and social constraint.

The YouTube playlist contains several non-film items. The private normalization records these as low-weight noise. It does not convert every saved video into a film preference.

The Instagram collection contains saved film recommendations and craft essays. It does not prove that every title was watched. The recommendation system must treat these saves as strong interest signals.

## Current recommendation architecture

1. Simkl stores shared history and Plan to Watch.
2. Watchly reads Simkl and generates Top Picks, Because You Watched, themes, creators, loved-title, and liked-title rows.
3. Curated Discovery protects regional, documentary, historical, animation, and arthouse breadth.
4. MUBI, BFI, Criterion, festival, and canon rows protect editorial discovery.
5. AIOMetadata supplies metadata, search, service catalogs, and the pending Simkl watchlist rows.
6. MovieLens remains optional until the public host proves that its protected integration is available.

## Private durable records

The private data lives in ignored files:

- `private/taste-profile.json`
- `private/google-watchlists-2026-09-01.json`
- `private/youtube-cinema-playlist-2026-09-01.json`
- `private/instagram-cinema-saves-2026-09-01.json`

These files preserve title-level taste data without publishing account links or personal history in the repository.

## Remaining actions

1. Load the protected AIOMetadata configuration.
2. Keep Simkl Checkin off.
3. Add Simkl Plan to Watch rows for movies, shows, and anime.
4. Hide the legacy MDBList watchlist from Home after the Simkl rows work.
5. Sign in to Letterboxd and export or read its history and watchlist.
6. Provide or re-highlight the exact IFFMH 2025 watched-and-loved titles.

## Confidence and gaps

**Google watchlists:** High. Both live signed-in lists were read, counted, and deduplicated.  
**YouTube playlist:** High for visible items. Two unavailable videos remain unknown.  
**Instagram collection:** High for the 12 visible saves. Saved status does not prove watched status.  
**Simkl and Watchly:** High. The live Watchly configuration and manifest show the active path.  
**Letterboxd:** Low until sign-in succeeds.  
**IFFMH:** Low for the personal subset. The official 2025 program is available, but the earlier highlights are not.

The strongest evidence comes from signed-in list pages, live manifests, official source code, and local catalog audits. The weakest evidence is the missing IFFMH highlight state.
