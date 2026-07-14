# TIME — POC

Proof-of-concept exhibits for Michael's "Time" video: why time seems to slow down for elite athletes.

1. **The impossible deadline** — animated flight of a four-seam fastball with the see/decide/swing time budget, plus a release-extension "race" (same radar reading, different arrival times). Data: Statcast 2023–24.
2. **The aging experiment** — whiff rate on four-seamers by hitter age band × velocity. Old hitters hang on ordinary velocity (anticipation), lose exactly where the decision window collapses (98+).
3. **The biological floor** — every reaction time from the Paris 2024 and Tokyo 2020 Olympic 100 m finals vs. the 100 ms false-start rule, with an interactive reaction test.

Static site — `index.html` + `data.js` (generated from Baseball Savant pulls). No build step, no dependencies.

4. **The duel (commit window)** — interactive model of Michael's sketch: offense and defense on one clock, both running download → commit → react. Sliders for commit timing, cue leakage, and live options; defense's decide cost follows Hick's law. Late commit + no leaks + live counters = the defense arrives after the play.
