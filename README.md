# Winter Raven

**Winter Raven** is an independent, Norse-inspired educational website exploring psychology and the many ways people experience the world.

The experience begins at a snowy threshold: a raven watches over an ancient rune-carved doorway. The visitor enters an atmospheric archive organized into four halls.

## The four halls
- **Hugr's Hall — The Hall of the Mind:** psychological diagnoses.
- **The Weavers' Hall — The Hall of Syndromes:** named syndromes and their varied meanings.
- **The Hall of Shadows — The Hall of Fears:** phobias and fear-related concepts.
- **The Healers Hall — The Hall of Healing Practices:** an IFS-centered learning path, condition-specific IFS perspectives, other therapeutic methods, mind-and-body lifestyle practices, and natural and complementary approaches.

The Norse setting is symbolic creative framing. The educational material should remain evidence-informed, carefully sourced, and clear about the distinction between formal diagnoses, syndromes, and descriptive terms.

## Project files
- `index.html` — site shell and homepage
- `styles.css` — responsive winter atmosphere, hero image, snowfall, and layout
- `script.js` — hall directories, search, navigation, and educational article content for the first three halls and condition-specific IFS perspectives and practical guide connections
- `assets/winter-raven-threshold.jpg` — generated cinematic snowy raven and rune-door background

## Run locally
Open `index.html` in a browser, or run `python -m http.server 8000` and visit `http://localhost:8000`.

## Educational scope
Articles are intended for general education, not diagnosis or treatment. They should not replace assessment by a qualified professional. Article content is introductory and must be reviewed, expanded, and checked against reputable clinical and scientific sources before publication. Prescription medication and narcotic guidance are outside the scope. A separate critical-research section discusses documented medication risks in context without advising people to start, change, or stop treatment. Herbal and complementary content prioritizes practical implementation, evidence quality, accessibility, and clear safety information. Each of the 22 condition articles includes an individualized IFS-informed perspective and links only to relevant practical guides; where no relevant guide exists, the site says so rather than suggesting an unrelated practice.

## Design direction
A mysterious northern winter world: deep blue-black shadows, snow, stone, runes, ancient halls, and the raven as a recurring guide. New generated images can be added as the archive expands.


## Internal Family Systems (IFS)
IFS is Winter Raven's primary therapeutic framework. The Healers' Hall introduces the model, Self-leadership, parts mapping, unblending, protective responses, polarization, consent, pacing, and everyday reflection. These materials are educational and do not constitute IFS training or therapy. The site distinguishes IFS-informed supportive reflection from established condition-specific treatments and describes the evidence base as emerging and limited. The 2025 scoping review identified 27 studies, predominantly case studies and small or exploratory designs, so the site does not claim IFS is proven for all conditions. Trauma processing and unburdening are not taught as self-guided exercises.

## Independent deployment and Axiom integration

Winter Raven is a **standalone website and repository**, not a subdirectory or deploy target of Axiom Academia. Its public pages, imagery, and educational content are owned and deployed independently. Axiom Academia and other Raven projects must not overwrite Winter Raven's homepage, assets, or deployment configuration.

Future optional Axiom Services integration should use a versioned, explicitly configured interface (for example, a separate API endpoint) for consent-based learning progress and achievements. No Axiom API endpoint, shared login, synchronization, or cross-site tracking is currently configured by this documentation. Keep the educational archive accessible without an Axiom account; do not send sensitive psychology browsing history to Axiom by default.

## Homepage background maintenance

The snowy raven homepage asset is `assets/winter-raven-home.jpg`. The fixed `.sky` backdrop is layered above the body's opaque paint and below site content. It uses a stable `100svh` viewport height to avoid mobile browser toolbar resizing, with a separate landscape composition. Avoid reintroducing a negative stacking index on `.home-page .sky` or dynamic `100dvh` sizing on the mobile hero.
