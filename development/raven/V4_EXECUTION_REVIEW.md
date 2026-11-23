# Raven V4 — execution blocker and visual review (2026-11-22)

## Execution environment
The available local container does not have a Blender executable or Python `bpy`. An attempt to refresh Debian package indexes timed out due to unavailable package-network access. Therefore **no successful Blender run was obtained here**. No rigged GLB or new pose images have been verified. Do not label this work as completed deformation validation.

## Existing static multi-view inspection
Reviewed the V4 static comparison image (rear, side, three-quarter, top). Findings:
- The rear/top views reveal a long wing outline but nearly uniform, repetitive feather rows.
- The side view reveals a conspicuous layered-fan effect rather than a smoothly continuous airfoil.
- The torso/shoulder transitions remain geometrically abrupt, and the head is still made of distinct round primitives.
- These are **static-model issues**; the images cannot establish whether elbow/wrist deformation tears, intersects or exposes joints.

## Corrective code changes
- Repaired the four sample frames: neutral 1, downstroke 13, upstroke 37, recovery 25 (previous recovery frame 61 duplicated a downstroke phase).
- Added explicit elbow/wrist pose-angle comparisons so a nonmoving rig cannot pass.
- Added side, top and three-quarter renders for each of four wing phases, in addition to the four rear renders.
- Validator now requires 16 pose renders, a skin with 13 named joints, weighted meshes, and nontrivial animation channels.
- Public site is unchanged.

## Required next evidence
1. GitHub Actions Blender step completes without error.
2. `raven_rigged_v4.glb`, `pose_angles.json`, `glb_validation.json` and 16 diagnostic PNGs exist.
3. Inspect the actual renders for shoulder gaps, elbow pinching, wrist twisting, vane penetration and bilateral mismatches.
4. Revise weights and feather-to-bone attachments based on those images, then rerender and obtain multi-view approval.

**No deployment until these conditions are met.**
