# Blender Armatures, AI-Assisted Rigging, and GLB Validation
Research date: 2026-11-22 | Project: Axiom / Winter Raven | Status: technical research, not evidence of a completed rig

## 1. What Blender's armature actually does
An armature is a hierarchy of bones in rest and pose states. The Armature modifier deforms a mesh using corresponding named vertex groups or bone envelopes. In the vertex-group method, each vertex receives one or more bone influences; a vertex's deformed position is a weighted combination of bone transformations. The Armature modifier's Preserve Volume option uses quaternion-based deformation to reduce joint collapse, but it is not a universal cure and may introduce discontinuities at extreme rotations. Bone placement, rest matrices, object transforms, and weight normalization must all be consistent.

Primary documentation: https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/armature.html

## 2. How ChatGPT can work with Blender
ChatGPT cannot directly manipulate an unseen local Blender GUI. It can generate, inspect, revise and explain Python scripts for Blender's `bpy` API, create test specifications, diagnose provided console logs, compare rendered images, and write CI pipelines that execute Blender in background mode. A working Blender executable, compatible add-ons and rendering environment are still required to execute those scripts. Generated scripts must be tested rather than assumed correct. Never claim an armature or export passed merely because the script was committed.

Recommended workflow:
1. Build a deterministic static source GLB and preserve it under a versioned path.
2. Import into Blender using `bpy.ops.import_scene.gltf`, check imported object names and matrices, and ensure the coordinate convention is documented.
3. Create edit bones with parent relationships and explicit rest positions. For a raven, shoulder/elbow/wrist/hand chains are approximations of the avian humerus, forearm and hand, not a literal complete skeleton.
4. Create vertex groups with names matching deforming bones, assign normalized influences, and verify every intended skinned vertex has nonzero weight.
5. Apply armature modifiers and parent objects without double-transforming them; verify rest pose is unchanged after parenting.
6. Animate shoulder, elbow, wrist and outer primaries with phase offsets and biologically plausible ranges; compare world-space vertex displacement across key frames.
7. Render diagnostic orthographic rear/top/side and three-quarter views in neutral, downstroke, upstroke and recovery poses.
8. Export glTF 2.0 binary GLB with skinning and animation enabled; independently inspect JSON for `skins`, `JOINTS_0`, `WEIGHTS_0`, named joint nodes, `animations`, and animation channels.
9. Re-import the exported GLB in a clean Blender scene or a separate glTF viewer; test playback, texture appearance and bind-pose consistency.
10. Only then consider deployment to the public site, after multi-view approval and browser performance tests.

## 3. glTF export pitfalls
- A Blender armature existing in a .blend does not guarantee the exported GLB contains a skin.
- An animation action existing in Blender does not guarantee it is exported; glTF export mode, active action, NLA tracks and bake settings matter.
- Vertex groups not matching deform bones can yield unskinned meshes.
- Bone influence count should be limited to a viewer-compatible number (typically four per vertex for portable assets).
- Export transforms and rest pose can create shifted or double-transformed geometry.
- UVs and PBR maps must be connected to supported material nodes; Blender procedural nodes are not all portable to glTF.
- A validator must fail on missing skinning and animation, rather than merely checking file size or mesh count.
Documentation: https://docs.blender.org/manual/en/4.0/addons/import_export/scene_gltf2.html ; https://docs.blender.org/manual/en/3.6/addons/import_export/scene_gltf2.html

## 4. V4 acceptance contract
Required files:
- `raven_rigged_v4.glb`
- `bend_neutral.png`
- `bend_downstroke.png`
- `bend_upstroke.png`
- `bend_recovery.png`

Required GLB content:
- `skins` with at least 13 joints
- all 13 bones: Root, Spine, Neck, Head, Tail, Shoulder.L/R, Elbow.L/R, Wrist.L/R, Primaries.L/R
- mesh primitives containing `JOINTS_0` and `WEIGHTS_0`
- one or more animation clips with meaningful wing rotation channels and sampled temporal variation
- no missing texture dependencies

Required image review:
- both wings visibly bend at shoulder, elbow and wrist
- no exposed gaps between feather rows or at the wing root
- no self-intersections that visibly puncture the wing silhouette
- no broken, inverted, detached or stretched feathers
- acceptable left/right symmetry for matched phases
- correct body silhouette from rear, side, top and three-quarter views
- no production promotion before human multi-view acceptance

## 5. Improvements to implement after successful first rig
Use feather attachment-to-bone mapping instead of weighting every vane uniformly by world X. Rigid or near-rigid primary feather vanes should follow the hand/wrist chain; coverts can overlap across joints. Add secondary-feather attachment to the ulna/forearm region and local feather rotation controls. Evaluate deformed-mesh intersections and wingtip trajectory, then tune pose timing using video references rather than generic sinusoidal motion.

## 6. Evidence and limits
Blender documentation supports the armature and export mechanics. The proposed V4 weighting and rig strategy are project engineering choices, not guarantees of anatomical accuracy. A successful static GLB build is not a successful Blender rig run.

Sources:
- Blender Armature Modifier: https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/armature.html
- Blender glTF 4.0 exporter: https://docs.blender.org/manual/en/4.0/addons/import_export/scene_gltf2.html
- Blender glTF 3.6 exporter: https://docs.blender.org/manual/en/3.6/addons/import_export/scene_gltf2.html
