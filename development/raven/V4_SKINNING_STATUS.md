# Raven V4 — skeletal wing deformation validation

Date: 2026-11-22
Production site: **unchanged**.

## Committed assets
The Axiom framework includes the V4 static GLB and four layered feather maps (binary asset commit `1e1ac7b`), a Blender armature and skin-weight script, and a strict GLB export validator.

## Current validation results
- The static GLB was inspected locally: **608 geometry objects**, with both left and right wing mesh groups present.
- A separate numerical proxy checked the spatial weight-normalization logic and four wing deformation phases. All sampled weights were finite and normalized, and the sampled wing vertices moved under the proposed poses.
- This **does not validate Blender's actual armature modifier**. No successful Blender-exported rigged GLB or four Blender bend-pose renders has been verified.
- The GitHub Actions build now fails rather than silently passing if Blender or the skeletal export validation fails. Its run result remains unconfirmed.

## Rig acceptance requirements
The exported GLB must contain skin joints and vertex weights, the 13 named bones, wingbeat animation channels, and four rendered pose images. A reviewer must then inspect elbow and wrist folding for tearing, gaps, unnatural feather intersections and asymmetric deformation. Multi-view approval is required before any deployment.

## Source of truth
Axiom: `assets/creatures/raven/versions/v4/`
Workflow: `.github/workflows/raven-v4-build.yml`
No production HTML or JavaScript files are modified.
