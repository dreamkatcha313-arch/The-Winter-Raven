# Raven production asset — visual quality and rig contract

Status: **development**, not approved for production. The existing `raven-rigged.gltf` is a low-detail articulated prototype and must not be promoted as photorealistic.

## Visual reference and orientation
- Common raven (*Corvus corax*), rear three-quarter view, flying away from the camera (beak toward local -Z; camera at +Z).
- Anatomically tapered torso and neck, wedge-shaped tail, elongated hand-wing with distinct primary tips; avoid oval body, straight rod wings, oversized eyes, and flat rectangular feather planes.
- Layered scapulars, coverts, secondaries and primaries; no disconnected geometry or obvious repeated primitives.
- Black feather albedo with subtle angle-dependent blue/violet iridescence, physically plausible roughness and normals; retain silhouette under dim blue storm lighting.
- At least 1024px authored feather albedo/normal/roughness texture maps for the full-quality version, with mobile texture variants when required.

## Rig and animation
- glTF 2.0 / GLB, skinned meshes, inverse bind matrices, meaningful skin weights, at least 8 joints.
- Symmetric shoulder, elbow, wrist, and finger/primary control joints; tail spread control.
- Looping Flight_Wingbeat animation plus Glide and Dive_Fold where feasible; continuous transitions without joint snapping.
- Wingbeat is anatomically asymmetric through downstroke/upstroke; wrist follows shoulder with phase delay.
- Geometry and animations must be checked from behind and at mobile intro size.

## Production acceptance
- Textured skinned mesh, >=8 bones, >=3000 triangles and named flight animation (runtime minimum checks; **not** a guarantee of visual quality).
- Render contact sheets from rear, three-quarter, top, and side viewpoints and compare to real common raven flight references.
- Verify at 360x800 and 1440x900, with both dark and bright atmospheric backgrounds.
- Check flight path remains centered, silhouette identifiable, no wing clipping or inverted wing bends.
- Check model load, fallback, animation, memory disposal, and mobile frame timing.
- Do not replace the live procedural fallback until visual sign-off.

## Current assets
- `The-Winter-Raven/assets/raven/raven-rigged.gltf`: early skeletal-style prototype, **not production quality**.
- `Axiom-Development-Framework/assets/creatures/raven/raven-rigged.gltf`: same reusable development prototype.
- Live website loads only `assets/raven/raven-rigged.glb` if it meets production checks; otherwise uses the previous procedural raven.
