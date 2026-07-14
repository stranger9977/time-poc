# TIME — POC

Proof-of-concept exhibits for Michael's "Time" video: why time seems to slow down for elite athletes.

1. **The impossible deadline** — animated flight of a four-seam fastball with the see/decide/swing time budget, plus a release-extension "race" (same radar reading, different arrival times). Data: Statcast 2023–24.
2. **The aging experiment** — whiff rate on four-seamers by hitter age band × velocity. Old hitters hang on ordinary velocity (anticipation), lose exactly where the decision window collapses (98+).
3. **The biological floor** — every reaction time from the Paris 2024 and Tokyo 2020 Olympic 100 m finals vs. the 100 ms false-start rule, with an interactive reaction test.

Static site — `index.html` + `data.js` (generated from Baseball Savant pulls). No build step, no dependencies.

4. **The duel (jump the move)** — playable version of Michael's commit-window sketch: you guard the offense with arrow keys/buttons across three stages (1, 2, then 4 live options), then the page plots your own reaction times on a log2(N+1) axis with a fitted Hick–Hyman line — your personal slope in ms per bit of uncertainty. Append `?hickdemo` to preview the results chart with synthetic reps.

**`commitwindow.js`** — the shared commit-window diagram module: the fan of options uses the game's actual four decisions (drive left / pull-up / drive right / pass) and captions use real sport examples (hitter reading release, weak-side defender, CP3's counters). Embedded at the top of Exhibit 4 on index.html (buttons only) and full-screen in duel.html (keyboard + deep links).

**`duel.html`** — the clean, narratable visual of the commit-window concept (built after Michael asked how to visualize it for the video): 16:9 stage, six beats stepped with arrow keys matching his four points plus intro/duality, average ↔ elite toggle that morphs the geometry (commit slides later, leaks seal, options multiply, the defense's window of certainty collapses from 560 ms to 290 ms and the verdict flips to BEATEN). Press H to hide the chrome for screen-recording. Deep-linkable: `?beat=3&mode=elite`.
