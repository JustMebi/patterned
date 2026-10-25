# Phase 2 Blender Mannequin Preparation

## Objective

Prepare the first mannequin asset for browser-side morphing in Patterned.

This is not a final fashion avatar. It is a technically stable prototype mannequin that:

- loads cleanly in the web app
- supports a small morph-target set
- preserves topology across all variations
- is neutral enough to fit garments against later

## Asset Target

The first export target is:

`apps/web/public/models/mannequin.glb`

The source Blender file can live outside the repo if that is easier for you, but the exported `.glb` should eventually land at the target above.

## What You Are Building In Blender

Create:

1. One neutral base mannequin mesh
2. Seven morph-capable body-shape variations implemented as shape keys

The required shape keys are:

1. `bust`
2. `waist`
3. `fullHip`
4. `shoulderWidth`
5. `torsoLength`
6. `armLength`
7. `legLength`

These names must match exactly.

## First-Pass Mannequin Rules

The mannequin should be:

- faceless or very simplified in the face area
- hairless
- neutral pose
- symmetrical
- unclothed but non-explicit in presentation
- proportionally believable rather than highly detailed
- light enough for browser use

Do not spend time yet on:

- detailed hands
- detailed feet
- facial realism
- pores
- advanced rigging
- animation
- cloth simulation
- multiple materials unless truly necessary

## Recommended Pose

Use a neutral standing pose:

- standing upright
- arms slightly away from the body
- hands relaxed
- legs straight but not stiffly locked
- feet flat and evenly spaced

The purpose is to avoid self-intersection and to leave space for later garment fitting.

## Naming Contract

Use these exact names where possible:

- Object name: `Mannequin_Body`
- Primary material: `Mannequin_Default`
- Shape keys:
  - `Basis`
  - `bust`
  - `waist`
  - `fullHip`
  - `shoulderWidth`
  - `torsoLength`
  - `armLength`
  - `legLength`

## Technical Constraints

These are mandatory:

1. All shape keys must be created from the same base mesh.
2. Vertex count must remain identical across all shape keys.
3. Vertex order must remain identical across all shape keys.
4. Do not apply operations that rebuild topology after shape keys are established.
5. Keep transforms clean before export.
6. Export as `.glb`.

## Modeling Guidance By Morph Target

### `bust`

Change:

- chest volume
- upper front torso contour
- slight surrounding ribcage transition if needed

Do not:

- create unrealistic isolated ballooning
- distort shoulders or arm attachment badly

### `waist`

Change:

- waist circumference
- side-seam contour
- front-to-side transition
- back waist narrowing or widening as needed

Do not:

- crush the torso unnaturally
- create sharp pinching

### `fullHip`

Change:

- hip circumference
- seat projection
- upper thigh transition

Do not:

- change leg length
- introduce obvious lower-body asymmetry

### `shoulderWidth`

Change:

- shoulder span
- upper torso silhouette near deltoids

Do not:

- make the neck base collapse
- create disconnected-looking arm sockets

### `torsoLength`

Change:

- shoulder-to-waist distance
- waist placement relative to bust and hips

Do not:

- simply scale the full mesh vertically
- move the entire body uniformly

### `armLength`

Change:

- upper and lower arm length in believable proportion

Do not:

- enlarge arm thickness to fake length
- shift shoulders dramatically

### `legLength`

Change:

- upper and lower leg length in believable proportion
- inseam-relevant body length

Do not:

- scale the full body upward as a shortcut
- let the pelvis distort badly

## Height Handling Rule

For this first prototype, do not create a separate `height` morph target.

Height will initially be represented indirectly through:

- `torsoLength`
- `legLength`

This is deliberate. A single global height scale would be too crude for the body model we want.

## Blender Setup Instructions

## Step 1: Start the source file

1. Open Blender.
2. Create a new file dedicated to the mannequin.
3. Save it with a clear name such as `patterned_mannequin_v01.blend`.
4. In Scene Properties or unit settings, set units to metric.
5. Work at real-world scale.

## Step 2: Build or import the neutral base body

1. Create the neutral body mesh or import a clean base you are allowed to use.
2. Remove unnecessary accessories or detail.
3. Make sure the body is one primary mesh for the prototype.
4. Keep the mesh symmetrical unless you have a strong reason not to.
5. Put the model in a neutral standing pose before shape-key work begins.

## Step 3: Clean the base mesh

1. Apply object transforms if needed so scale and rotation are clean.
2. Recalculate normals if the mesh looks inconsistent.
3. Remove hidden duplicate geometry, internal junk, and stray vertices.
4. Keep topology reasonably even in areas that must deform:
   - bust
   - waist
   - hips
   - shoulders
   - upper arms
   - upper legs

## Step 4: Rename the object and material

1. Rename the mesh object to `Mannequin_Body`.
2. Rename the primary material to `Mannequin_Default`.
3. Use one simple prototype material if possible.

## Step 5: Create the shape keys

1. Add a `Basis` shape key.
2. Duplicate from the basis to create:
   - `bust`
   - `waist`
   - `fullHip`
   - `shoulderWidth`
   - `torsoLength`
   - `armLength`
   - `legLength`
3. Edit each shape key individually in Edit Mode.
4. Keep the edits anatomically believable.
5. Return each shape key value to `0` after editing so the neutral body remains the visible default.

## Step 6: Sanity-check the keys in Blender

For each shape key:

1. Set the key to `1.0`.
2. Inspect the mesh from front, side, and three-quarter views.
3. Check for:
   - mesh tearing
   - shading glitches
   - self-intersection
   - unnatural pinching
   - broken silhouette
4. Return the key to `0`.

Then test combined states:

1. `bust + waist`
2. `waist + fullHip`
3. `torsoLength + legLength`
4. `shoulderWidth + bust`

This matters because the browser will eventually combine these influences.

## Step 7: Prepare export

Before export:

1. Ensure only the intended mesh is exported.
2. Keep the shape keys on the mesh.
3. Keep materials simple.
4. Do not rely on Blender-only modifiers that will not export the way you expect.
5. Confirm the object origin and world placement are sensible.

## Step 8: Export

1. Export using glTF 2.0.
2. Choose binary `.glb`.
3. Export the selected mannequin object.
4. Preserve shape keys.
5. Save the result as `mannequin.glb`.

Target path:

`apps/web/public/models/mannequin.glb`

## What To Send Back To Me After Your First Blender Pass

After the first pass, return:

1. confirmation that the source `.blend` file exists
2. the exported `.glb`
3. screenshots of:
   - neutral body front
   - neutral body side
   - `bust` at `1.0`
   - `waist` at `1.0`
   - `fullHip` at `1.0`
   - `torsoLength` at `1.0`
4. any Blender issues you hit while creating the shape keys

## What I Will Check Once You Export

I will review:

- whether the mesh naming matches the contract
- whether the morph-target names match the code contract
- whether the key set is complete
- whether the asset path is correct
- whether the shape-key strategy is sufficient for browser-side measurement mapping

## First-Pass Success Criteria

Phase 2 is successful when:

1. `mannequin.glb` exists at the reserved path
2. the mesh name and morph-target names are stable
3. the mannequin remains believable through the first key range
4. the asset is clean enough for Phase 3 integration work
