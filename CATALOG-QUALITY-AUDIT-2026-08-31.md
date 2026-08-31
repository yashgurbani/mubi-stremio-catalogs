# Catalog quality and personalized discovery audit — 31 August 2026

## Executive summary

The setup has a strong technical foundation, but its discovery rows do not all serve the same purpose. Watchly and the official MUBI rows provide personal or editorial selection. Cinemeta, Netflix-latest rows, and the Indian Regional Catalog mainly provide popularity, availability, or recency. Mixing these rows without clear priority makes the homepage feel less curated than the source stack suggests.

The Indian Regional Catalog explains the most visible quality problem. It exposes 20 movie and series catalogs across nine Indian languages, Hindi-dubbed content, and OTT releases. A live first-page sample found no populated `imdbRating` field in any catalog. Most Hindi, Tamil, and Malayalam movie samples concentrated on 2026 releases. The sample also contained one promotional item and repeated titles across language and OTT rows. This evidence does not prove that the films are poor. It proves that the raw catalog order does not expose a critical-quality signal.

The correct fix is layered discovery. Watchly remains the personal engine. Official MUBI, BFI, Criterion, festival, award, and canon rows provide editorial quality. The Indian Regional Catalog remains installed for broad and recent coverage, but its raw rows move later on Home. New Indian discovery rows must combine personal similarity with critic, festival, award, and language-aware audience signals. A single global vote threshold would hide important regional and archival work.

The private taste profile now defines ten discovery lanes for films, television, documentaries, Indian cinema, global arthouse, and animation. It also records `Balanced` as the target Watchly discovery style. The current live style remains `Everything` until an approved settings save.

**Overall confidence:** High for the diagnosis of the regional row logic. Medium for item-level quality because the addon does not publish its ranking method.

## Methodology

**Research period:** August 2026  
**Mode:** Verbose, targeted maintenance audit

### Queries used

- `"Indian Regional Catalog" Stremio addon GitHub`
- `site:github.com cedya77 aiometadata catalogs mdblist tmdb discover language rating`
- `TMDB API discover movie vote_average.gte vote_count.gte with_original_language official documentation`
- `MDBList documentation custom lists filters ratings language country official`
- `site:bfi.org.uk Indian cinema greatest films list BFI`
- `site:pib.gov.in IFFI 2025 Indian Panorama feature films selection`
- `site:filmheritagefoundation.co.in restorations Indian classic films list`
- `site:github.com/TimilsinaBimal/Watchly documentaries recommendations genres keywords Watchly`

### Live checks

- Read the public Indian Regional Catalog manifest, version 1.0.6.
- Sampled the first 20 items from every exposed movie and series catalog.
- Measured rating-field coverage, promotional entries, synthetic identifiers, recency concentration, and repeated titles.
- Compared the installed catalog roles with the current Watchly, MUBI, AIOMetadata, Cinemeta, and Nuvio account evidence.
- Compared the proposed filters with official TMDB Discover parameters and MDBList list types.

### Filters applied

- Official product documentation and first-party catalogs were primary sources.
- Community directories were used only to identify the regional add-on and its declared purpose.
- Popularity and vote totals were not treated as artistic quality.
- Low vote totals did not disqualify festival, archival, or regional films.

### Known limitations before synthesis

- The Indian Regional Catalog does not publish its complete ranking method.
- The audit sampled the first page of each row rather than every page.
- The current Stremio Web session is anonymous, so its real-account homepage remains unverified.
- The public AIOMetadata instance remains on 2.16.2. Its Letterboxd URL-import repair is not available yet.
- The public AIOMetadata API does not expose MovieLens server readiness.

## Background

A useful television homepage needs more than broad metadata coverage. Each row needs a clear job. Personal rows answer “what fits my taste?” Editorial rows answer “what matters or deserves attention?” Availability rows answer “what is new or present on a service?” Raw popularity rows answer only “what attracts activity now?”

Indian cinema needs special treatment because vote volume varies sharply by language, age, distribution, and international visibility. A large Hindi release can collect far more votes than an important Assamese, Manipuri, Bengali, Malayalam, Marathi, or restored archival film. A universal vote-count floor creates a mainstream and language bias.

The target homepage therefore uses three layers:

1. Personal relevance from Watchly and the central watchlist.
2. Editorial quality from trusted curators, awards, festivals, and film-history sources.
3. Broad freshness and availability from regional and streaming-service catalogs.

## Finding 1: the regional add-on is a breadth source, not a quality curator

### Evidence supporting the finding

- The public manifest exposes 20 catalogs across nine Indian languages, Hindi-dubbed content, and OTT releases.
- Every first-page sample had zero populated `imdbRating` values.
- The Hindi and Tamil movie samples consisted entirely of 2026 titles.
- The Malayalam movie sample also consisted entirely of 2026 titles.
- The Telugu sample contained a promotional catalog item.
- The OTT sample repeated titles from language rows and included non-Indian global series.
- Four normalized titles appeared more than once across sampled rows.

The reproducible audit is [scripts/audit-catalog-quality.ps1](scripts/audit-catalog-quality.ps1). The add-on declares that it tracks daily updates and organizes titles by language on its [configuration page](https://indian-regional-catalog.vercel.app/).

### Counter-evidence

Recency-first ordering has genuine value. It can surface small releases that critic databases or popularity filters miss. The absence of a rating field also does not prove the absence of good films.

### Methodology critique

The audit measures visible ranking signals, not artistic merit. It cannot distinguish a neglected masterpiece from a weak release through metadata alone.

### Conflicting interpretations

- **Interpretation A:** The row quality is poor because most titles are unfamiliar and unrated.
- **Interpretation B:** The rows are broad release indexes whose purpose is discovery, not quality ranking.

The evidence supports Interpretation B. The interface problem comes from placing a release index where the user expects curation.

### Conclusion

Keep the add-on, but demote its raw rows. Use selected language rows late on Home and retain the full breadth for search and long-scroll discovery.

**Confidence:** High. The live manifest and catalog responses directly support this conclusion.

## Finding 2: one global rating threshold would damage regional discovery

### Evidence supporting the finding

TMDB supports `vote_average.gte`, `vote_count.gte`, `with_original_language`, and many other discover filters. It also warns that filter combinations use explicit AND and OR rules. See the official [TMDB Discover Movie documentation](https://developer.themoviedb.org/reference/discover-movie).

MDBList dynamic lists support ratings, genres, years, keywords, streaming services, languages, and other filters. These lists refresh when source data changes. See [MDBList list types](https://docs.mdblist.com/docs/list_types).

BFI editorial coverage demonstrates the breadth of important Indian cinema across periods, movements, and languages. Its Indian cinema hub includes modern independent films, Parallel Cinema, Indian arthouse, Bollywood, directors, and regional contexts. See the [BFI Indian cinema index](https://www.bfi.org.uk/articles/subject/indian-cinema).

The Film Heritage Foundation list of 14 iconic Indian films includes Malayalam, Tamil, Bengali, Hindi, and Gujarati-associated works that often sit outside mainstream popularity. See [14 iconic Indian films](https://filmheritagefoundation.co.in/the-festival-des-3-continents-to-include-14-iconic-indian-films-in-the-classics-section-at-its-44th-edition/).

### Counter-evidence

A minimum vote count removes spam, unreleased placeholders, and unstable high averages from tiny samples. It improves current-release rows when used carefully.

### Methodology critique

Neither TMDB nor MDBList supplies an objective definition of quality. Their filters expose signals, not final judgments.

### Conclusion

Use language-aware thresholds for dynamic rows. Bypass vote thresholds for exact festival, award, archival, and canon lists.

**Confidence:** High for the filter design. Medium for exact thresholds, which require live result previews.

## Finding 3: personal discovery needs more than generic recommendations

### Evidence supporting the finding

Watchly builds a numerical profile from genres, keywords, directors, cast, eras, countries, and runtime. It can generate Top Picks, recent-item rows, themes, creator rows, loved-title rows, and liked-title rows. See the [Watchly repository](https://github.com/TimilsinaBimal/Watchly).

Watchly offers four discovery styles: mainstream, balanced, gems, and everything. The current private profile records `Everything`. That setting protects breadth, but it weakens the quality boundary when many other broad rows already exist.

The live Watchly manifest exposes 16 rows. It includes Top Picks, two recent-item rows, taste themes, creator rows, loved-title rows, and liked-title rows.

### Counter-evidence

Changing Watchly to `Balanced` can reduce unusual recommendations. The homepage still needs deliberate serendipity and low-popularity work.

### Conclusion

Use `Balanced` for Watchly. Preserve serendipity through separate hidden-gem, festival, MUBI, BFI, Criterion, and regional rows.

**Confidence:** Medium-high. Watchly documents the styles, but the public instance does not expose the exact scoring weights.

## Finding 4: curated discovery needs separate film, television, and documentary lanes

Films, television, and documentaries have different discovery patterns. A single “critically acclaimed” row blends incompatible intents and often promotes the most popular items.

The private taste profile now defines these ten lanes:

1. Quiet Intimacy & Modern Relationships
2. Diaspora, Identity & Home
3. Systems, Power & Moral Ambiguity
4. Science, Technology & Obsession
5. Smart Ensemble Comedy
6. Dark, Strange & Animated
7. Comfort Animation & Whimsy
8. Indian Cinema: Canon, Craft & Regional Voices
9. Global Arthouse & Formal Discovery
10. Documentary Discovery: Science, Society & Art

These lanes do not publish the private watch history. They serve as stable discovery intents that dynamic systems can populate from current taste data.

The deployed curated addon implements eight of these intents as concrete shelves. It contains 112 taste-informed titles plus 14 source-faithful Film Heritage Foundation titles. No exact title overlaps the known watched-series journal or explicit watchlist.

The implemented shelves are:

1. For You — Intimate, Thoughtful Films
2. For You — Indian Indie & Regional
3. Documentary Discovery — Science, Society & Art
4. For You — Prestige TV Beyond the Obvious
5. Because You Liked — Smart Ensemble Comedy
6. Animation — Dark, Strange & Funny
7. Comfort Animation & Whimsy
8. For You — Global Arthouse Discovery
9. 14 Iconic Indian Films — FHF

This catalog is the stable editorial layer. Watchly remains the adaptive layer that responds to new Simkl activity.

**Confidence:** High for alignment with the recorded taste profile. Medium for recommendation precision until more explicit ratings reach Simkl.

## Catalog scorecard

| Catalog family | Personal relevance | Editorial quality | Breadth | Freshness | Homepage role |
|---|---:|---:|---:|---:|---|
| Watchly Top Picks | High | Medium | Medium | High | Lead discovery row |
| Watchly Because You Watched | Medium-high | Medium | Medium | High | Early, but rotate below Top Picks |
| Watchly theme and creator rows | High | Medium | Medium | High | Early to middle |
| Personal watchlist | Exact | User-curated | Exact | Dynamic | Near the top |
| Official MUBI collections | Medium | Very high | Narrow | Monthly snapshot | Late editorial section |
| BFI and Criterion rows | Medium | Very high | Medium | Medium | High-priority film discovery |
| Film and television canons | Medium | High | Medium | Low | Stable reference rows |
| Documentary discovery | High target | High target | Medium | Medium | Dedicated film and series rows |
| Festival and award rows | Medium | High | Medium | Annual | High-priority regional discovery |
| Netflix latest | Low-medium | Low | High | High | Coverage row, below quality rows |
| Indian Regional Catalog | Low-medium | Unproven | Very high | Very high | Late-homepage breadth layer |
| Cinemeta Popular and Featured | Low | Low | Medium | Medium | Keep one baseline or demote duplicates |
| Massive Nuvio community folders | Variable | Variable | Extremely high | Variable | Keep hidden unless selected |

## Target homepage order

The final order can exceed 20 rows. Priority matters more than a hard row limit.

1. Continue Watching
2. Your Watchlist
3. Watchly Top Picks — Movies
4. Watchly Top Picks — Series
5. Watchly Because You Watched — Movies
6. Watchly Because You Watched — Series
7. Watchly taste themes and creators
8. Quiet Intimacy & Modern Relationships
9. Diaspora, Identity & Home
10. Smart Ensemble Comedy
11. Systems, Power & Moral Ambiguity
12. Science, Technology & Obsession
13. Documentary Discovery — Films
14. Documentary Discovery — Series
15. Indian Cinema: Canon, Craft & Regional Voices
16. Contemporary Indian Festival Cinema
17. Acclaimed Hindi Cinema
18. Acclaimed Tamil and Malayalam Cinema
19. Acclaimed Bengali, Marathi, Kannada, Telugu, and other regional cinema
20. Global Arthouse & Formal Discovery
21. BFI and Criterion spotlight rows
22. MUBI Now Showing
23. Netflix quality discovery
24. Netflix latest and other service-completeness rows
25. Comfort Animation & Whimsy
26. Dark, Strange & Animated
27. Film and television canons
28. Selected raw Indian regional latest rows
29. Official MUBI thematic collections
30. Remaining low-priority freshness and popularity rows

## Regional quality policy

Use the following signal order for Indian film and series discovery:

1. Personal taste similarity and explicit ratings.
2. Exact festival, award, critic, archival, and restoration membership.
3. Language-aware audience scores and vote floors.
4. Release freshness.
5. Popularity only as a tie-breaker.

The 2025 Indian Panorama offers an exact current festival source. The official selection includes 25 features and five debut nominees. The program states that the jury selects cinematic, thematic, and aesthetic excellence. See the [Press Information Bureau announcement](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2187868&lang=2&reg=48) and the [official IFFI selection](https://iffigoa.org/indian-panorama/official-selection-feature?year=2025).

Sight and Sound ballots from Indian critics, scholars, and filmmakers provide another high-signal source. Examples include [Shubhra Gupta](https://www.bfi.org.uk/sight-and-sound/greatest-films-all-time/all-voters/shubhra-gupta), [Omar Ahmed](https://www.bfi.org.uk/sight-and-sound/greatest-films-all-time/all-voters/omar-ahmed), and [Sangeeta Datta](https://www.bfi.org.uk/sight-and-sound/greatest-films-all-time/all-voters/sangeeta-datta).

## Implementation decisions

### Completed in this pass

- Added a reproducible quality audit for all 20 Indian Regional Catalog rows.
- Recorded ten private, taste-based discovery lanes.
- Added quality guardrails that preserve low-vote festival and regional films.
- Added a separate source-faithful Indian cinema manifest with the exact Film Heritage Foundation 14-film program.
- Resolved all 14 entries to working IMDb identifiers and checked them against Cinemeta.
- Recorded `Balanced` as the target Watchly discovery style.
- Retained the raw regional catalogs as late-homepage breadth rows.
- Confirmed that the three official MUBI Germany rows still match their live memberships.

### Pending account actions

- Change Watchly from `Everything` to `Balanced` after approval.
- Change Nuvio to Classic View and save the subtitle and timeout corrections.
- Sign in to the real Stremio account and audit its actual rows.
- Import Letterboxd watchlist and history after AIOMetadata reaches 2.16.3.
- Test MovieLens only after the public instance exposes a real connection path.
- Add source-backed Indian festival, canon, and contemporary quality rows through AIOMetadata or a separate static manifest.

## Devil's Advocate

A strongly curated homepage can become an echo chamber. Critic and festival sources have institutional biases. BFI and international festival coverage can overrepresent globally legible arthouse cinema. Rating thresholds can suppress films from smaller language industries. Personal scoring can overfit the latest watches and repeatedly recommend near-duplicates.

The design answers this criticism by keeping a mainstream baseline, raw regional freshness rows, and multiple editorial traditions. It also separates a personal ranking from canon membership. No single score decides every row.

## Source deep-dives

### Watchly — GitHub repository

- **Type:** Primary product documentation
- **Date:** Current repository documentation, accessed August 2026
- **Methodology:** Documents the implemented profile and catalog pipeline
- **Independence:** Self-published by the project
- **Key contribution:** Defines profile inputs, catalog types, refresh behavior, and discovery styles
- **Limitations:** Does not disclose all scoring weights for the hosted instance

### TMDB Discover Movie — TMDB

- **Type:** Primary API documentation
- **Date:** Current documentation, accessed August 2026
- **Methodology:** Defines supported query parameters and filter logic
- **Independence:** First-party API documentation
- **Key contribution:** Proves that language, vote-average, and vote-count filters are available
- **Limitations:** Does not define artistic quality or correct thresholds

### Indian Panorama 2025 — PIB and IFFI

- **Type:** Government and festival primary sources
- **Date:** November 2025
- **Methodology:** Jury selection from submitted feature and non-feature films
- **Geographic scope:** India, multiple languages
- **Independence:** Official program sources
- **Key contribution:** Supplies an exact, current, multilingual quality-selection source
- **Limitations:** Festival selection is not a complete survey of Indian releases

### BFI Indian cinema index and Sight and Sound ballots

- **Type:** Institutional editorial and expert poll sources
- **Date:** Mixed, accessed August 2026
- **Methodology:** Named-critic editorial lists and individual expert ballots
- **Geographic scope:** Indian and global cinema
- **Independence:** Editorially independent, but institutionally curated
- **Key contribution:** Supplies historical, formal, and regional cinema signals beyond popularity
- **Limitations:** International canon formation can underrepresent local popular traditions

### Film Heritage Foundation iconic films

- **Type:** Preservation institution and festival-program source
- **Date:** Program article accessed August 2026
- **Methodology:** A 14-film classics program with preservation context
- **Geographic scope:** Multiple Indian languages and regions
- **Independence:** Institution involved in restoration and preservation
- **Key contribution:** Identifies significant works that popularity filters can miss
- **Limitations:** A curated program is selective rather than comprehensive

## Confidence and gaps

**Overall confidence:** High for the structural diagnosis. Medium-high for the proposed homepage architecture.

- **Regional add-on role:** High confidence. Live catalog responses show freshness-first behavior and missing rating metadata.
- **Personal discovery design:** Medium-high confidence. The private taste profile is rich, but Simkl contains limited explicit ratings.
- **Indian quality sources:** High confidence for source authority. Medium confidence for final row membership until exact title resolution.
- **Global catalog quality:** Medium confidence. The real Stremio account remains unavailable for a complete row-by-row audit.
- **MovieLens:** Low confidence. Public server readiness remains unobservable.

The strongest evidence comes from the live manifests, catalog responses, Watchly documentation, official TMDB filters, IFFI sources, and BFI sources. The largest remaining gap is the anonymous Stremio Web session.

## Appendices

### A — Rejected source types

| Source type | Reason |
|---|---|
| Unattributed “best Indian movies” pages | No named methodology or curator |
| Generic IMDb-score-only lists | Popularity and vote-volume bias |
| AI-generated memberships without source links | Cannot prove exact membership |
| Service marketing lists | Availability does not prove quality |

### B — Audit command

```powershell
powershell -NoProfile -File .\scripts\audit-catalog-quality.ps1
```

Use `-FailOnQualityRisk` only for monitoring. A nonzero result means that the raw rows need review. It does not mean that the add-on must be removed.
