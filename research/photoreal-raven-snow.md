# Photorealistic Raven and Snow — Research & Implementation Specification
Research date: 2026-11-21
Status: evidence-informed design requirements, NOT a validated photorealistic model or completed physics simulation.

## 1. Raven reference species: Common raven (Corvus corax)
Sources:
- Cornell Lab All About Birds, identification: https://www.allaboutbirds.org/guide/Common_Raven/id
- US National Park Service, Common Raven: https://home.nps.gov/articles/000/common-raven.htm
- Audubon Field Guide: https://www.audubon.org/field-guide/bird/common-raven

Documented morphology:
- Thick neck, shaggy throat feathers, long heavy bill, long/narrow wings and distinct fingerlike outer primary tips.
- Wedge/diamond-shaped tail during flight, unlike a crow's more fan-shaped tail.
- Cornell lists 56–69 cm body length and 116–118 cm wingspan for its reference population; model proportions should be validated against multiple orthographic photo references rather than blindly enforcing one number.
- Flight: slow, heavy wingbeats, gliding and soaring.

Implementation:
- Construct a coherent tapered torso, thick-necked head, correctly oriented bill, scapular/coverts/secondaries/primaries, wedge tail.
- Separate feather layers must remain readable from a rear-facing camera at mobile size.
- Use skinning and shoulder/elbow/wrist/finger joints; secondary and primary feather movement should follow wing kinematics, not rotate as rigid horizontal rods.
- Validate silhouette from rear, side, top, and three-quarter views, and at the actual splash-screen pixel size.
- Avoid the oval-body/rod-wing prototype that caused a visible regression.

## 2. Plumage optics
Sources:
- Cornell Bird Academy, feather coloration: https://academy.allaboutbirds.org/how-birds-make-colorful-feathers/
- Maia et al., glossy black feathers and common raven microstructure: https://pmc.ncbi.nlm.nih.gov/articles/PMC3107640/
- Feather scattering research, Cornell graphics: https://www.graphics.cornell.edu/~todd/pcg/MS.html

Evidence:
- Feather color combines pigmentation and microstructure; directional reflectance and gloss matter.
- Research on glossy black feathers includes common raven plumage and relates gloss to surface/nanostructural properties.
- Do not assume all raven feathers exhibit strong rainbow iridescence.

Implementation hypotheses (art direction, not directly measured raven material constants):
- PBR black/dark-charcoal base color, feather-aligned anisotropic highlights where supported, spatially varied roughness and subtle blue-violet highlights only under appropriate lighting.
- Authored albedo, normal, roughness, and opacity maps; feather rachis/barb detail in normal and roughness, not repeated large ellipsoids.
- Test dark-scene readability without exaggerated glowing outlines.
- A minimum texture resolution alone does not guarantee realism.

## 3. Snow crystals and precipitation
Sources:
- NOAA snowflake formation: https://www.noaa.gov/stories/how-do-snowflakes-form-science-behind-snow
- NOAA NESDIS crystal morphology: https://www.nesdis.noaa.gov/about/k-12-education/ice-snow/how-do-snowflakes-form
- National Snow and Ice Data Center, snow science: https://nsidc.org/learn/parts-cryosphere/snow/science-snow
- Snow and Ice Animation Methods in Computer Graphics, Computer Graphics Forum: https://onlinelibrary.wiley.com/doi/full/10.1111/cgf.15059

Evidence:
- Ice crystal habits vary with temperature and humidity; crystal growth generally reflects sixfold ice symmetry.
- Real falling snow includes crystals and aggregates, and wind can fragment crystals into smaller particles.
- Snow rendering literature uses particles and, in more complex systems, gravity, buoyancy, lift, drag, wind fields, and accumulation.

Implementation hypotheses:
- Far field: tiny low-opacity flakes and haze; middle field: mixed irregular particles; near field: occasional soft defocused flakes, not identical luminous circles.
- Motion: downward gravity plus coherent gusts and low-amplitude turbulence; avoid all particles radiating from one central vanishing point.
- Use a single continuous wind field shared across particle layers, with independent drift and depth-based parallax.
- Lighting: cool overcast diffuse illumination, gentle forward-scattering haze, restrained highlights, and contrast attenuation by distance.
- Snow streak lengths should reflect exposure and relative motion, not stylized hyperspace lines.
- Budget mobile particle counts and pixel ratio, pre-render blur sprites, and pause hidden tabs.
- Keep the raven visible against the background, with foreground snow crossing it occasionally.

## 4. Integration and validation
Current Winter Raven state: procedural raven in production; low-detail glTF articulated prototype stored separately. A production quality gate exists but must not be treated as proof of photorealism.
- Phase A: gather properly licensed photographic orthographic and flight references (record licenses).
- Phase B: artist-authored or photogrammetry-informed mesh, layered feather geometry, skin weights and animation clips.
- Phase C: physically based texture set, coherent wind field, depth-aware snow and lighting.
- Phase D: rear-view contact sheet, 360x800 Android test, desktop test, performance metrics, animation playback, fallback test.
- Phase E: promote new asset only after user-approved visual comparison.
Acceptance: raven recognized as Corvus corax in silhouette, wing articulation credible, no clipping, storm looks like falling/blowing snow rather than a starfield, stable mobile frame rate.
