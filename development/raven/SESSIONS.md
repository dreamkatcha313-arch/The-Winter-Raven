# Raven development: 20 improvement work items
Date: 2026-11-21
Scope: deterministic development utilities and 20 corresponding assertions. These are engineering prototypes, not 20 visually validated production upgrades.

## Sessions and acceptance checks
01. Seeded randomness — reproducible snow sampling.
02. Clamp — bounds input parameters.
03. Smoothstep — smooth transitions for flight stages.
04. Wing chord taper — narrow wing tips.
05. Feather taper — pointed vanes rather than rectangles.
06. Feather camber — non-flat vane cross-section approximation.
07. Asymmetric vanes — different left/right barb widths.
08. Primary spread — separated wingtip feathers.
09. Secondary lengths — natural variation along wing.
10. Wedge-tail geometry — longer central tail feathers.
11. Wingbeat waveform — asymmetric downstroke/recovery.
12. Wrist phase lag — trailing distal wing response.
13. Feather lag — individual feather flex.
14. Dive fold — continuous transition from flight to dive.
15. Flight path — preserve away-from-camera recession.
16. Wind gust — coherent time-varying storm direction.
17. Integrated wind — smooth snow displacement under gust reversal.
18. Snow depth — layer-dependent opacity, size, parallax.
19. Snow position — continuous gravity and wind displacement.
20. Performance and quality gating — mobile particle budget and rejection of incomplete 3D models.

## Files
- raven-lab.js: 20 reusable utilities.
- raven-lab.test.mjs: 20 executable assertions (run `npm test` in this directory).
- package.json: Node ES module configuration.

## Release policy
The lab is deliberately not imported by index.html. The existing procedural raven and snowfall remain the public baseline.
Production raven-3d.js additionally disables fetching any unapproved external GLB and removes stale fallback state when disposed.

## Validation status
GitHub commits succeeded. Automated tests have been authored but have NOT been executed in a Node environment as part of this work. No browser screenshots, Android FPS measurements, rig inspection, or photorealism evaluation were performed. Before promoting individual utilities, execute tests, capture mobile and desktop renders, compare silhouettes and motion to licensed references, and obtain visual approval.
