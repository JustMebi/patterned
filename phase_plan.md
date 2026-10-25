# Patterned Execution Plan

## Source Basis

This plan is derived from:

- `plan1.md`, which defines the architecture, recommended stack, major layers, and the recommended build order.
- `initial_idea.md`, which frames the product as a combination of a digital dress form, pattern generator, fabric simulation system, and AI design assistant.

This file converts those ideas into a phase-by-phase working plan with clear ownership.

## Product Direction We Are Following

The project should not start as a full AI fashion platform. The first credible version is:

1. A browser-based digital dress form driven by measurements.
2. A mannequin that updates from structured measurement inputs.
3. A limited garment preview workflow using premade garment meshes.
4. A later pattern-engine track that is deterministic, testable, and separate from AI.

The product is best understood as three tightly related systems:

1. Digital mannequin and client measurement management.
2. Pattern generation and alteration logic.
3. Fabric and design visualization, later assisted by AI.

## Delivery Principles

These are the constraints we should treat as non-negotiable during setup:

1. Measurements are the source of truth, not the final 3D mesh.
2. AI interprets user intent, but deterministic code owns geometry, validation, sizing, and fit logic.
3. We should not attempt full cloth simulation or automatic pattern drafting in the first implementation pass.
4. The first Blender goal is not "make everything." It is "prepare one reliable mannequin asset pipeline."
5. We should build software harnesses around real assets, not ask AI to invent production-grade body models.

## Ownership Model

## What I am responsible for

- Writing and maintaining all repository-side code and documentation.
- Turning the product notes into concrete schemas, modules, APIs, and implementation checkpoints.
- Defining the TypeScript domain model for measurements, garments, fabrics, validation, and jobs.
- Setting up the web app structure, 3D viewer wiring, state handling, and persistence layer.
- Building the measurement normalization logic and the first measurement-to-morph mapping layer.
- Creating the pattern-engine scaffolding and later the deterministic drafting modules.
- Writing tests, validation utilities, import rules, and asset-integration checks.
- Producing Blender task instructions precise enough for you to execute without guesswork.
- Reviewing Blender outputs and translating problems into exact correction steps.

## What you are responsible for

- Operating Blender directly.
- Creating, editing, and exporting the mannequin source asset and its variations.
- Making visual and anatomical judgment calls when the asset needs artistic or practical adjustment.
- Confirming whether the mannequin and garments look believable enough for the intended audience.
- Providing reference measurements, screenshots, exported assets, and issue reports from Blender.
- Helping determine whether the drafting assumptions match real tailoring logic.
- Supplying or validating garment-domain rules when the software needs tailoring knowledge beyond generic coding.

## What we are jointly responsible for

- Locking scope before each phase begins.
- Choosing what is in the MVP and what is explicitly deferred.
- Agreeing on supported body ranges for the first release.
- Reviewing Blender outputs against the browser result.
- Validating whether the system behavior is technically correct and product-useful.
- Deciding when to stop iterating and freeze a milestone.

## Working Model for Blender-Guided Tasks

When a task requires Blender, ownership is split like this:

1. I define the target outcome.
2. I give you the exact Blender steps, export expectations, and validation checklist.
3. You execute the steps in Blender.
4. You return screenshots, notes, or exported files.
5. I evaluate the output and either approve it or issue a correction pass.
6. Once the process works, I document it so the next cycle is repeatable.

This is the main "you and I together" workflow in the project.

## Architecture We Should Treat As Current Baseline

## Core app stack

- Next.js
- React
- TypeScript
- React Three Fiber
- Three.js
- Zod
- PostgreSQL

## Likely repo shape

The notes point toward a monorepo. We do not need to implement the entire monorepo immediately, but we should structure toward it:

```text
apps/
  web/
  api/
  worker/
packages/
  garment-schema/
  measurement-engine/
  pattern-engine/
  fabric-catalogue/
  api-client/
  shared-utils/
```

## What we should not build from scratch

- The 3D rendering engine
- Authentication primitives
- Payments
- General file storage
- Basic image-upload flow
- Basic PDF infrastructure
- Core UI controls

## What we likely do need to own

- Measurement schema and supported ranges
- Measurement-to-body mapping
- Garment schema
- Pattern drafting rules
- Pattern validation rules
- Pattern transformations
- Pattern-to-3D seam mapping
- Tailor-oriented workflows

## Phase-by-Phase Plan

## Phase 0: Scope Lock and Internal Language

### Goal

Translate the saved notes into the first real product contract so implementation starts from stable definitions instead of broad product ambition.

### My responsibilities

- Create the first canonical schemas for:
  - `BodyMeasurements`
  - `GarmentDefinition`
  - `FabricDefinition`
- Define supported measurement ranges for MVP.
- Propose directory structure and package boundaries.
- Write the first acceptance criteria for the MVP.
- Identify explicit non-goals for the first milestone.

### Your responsibilities

- Confirm the target user for milestone one:
  - hobbyist/free
  - tailor/low-tier paid
  - designer or pro/high-tier paid
- Confirm whether the first milestone is:
  - mannequin only
  - mannequin plus one garment
  - mannequin plus one garment plus fabric preview
- Confirm the initial supported body range is realistic.
- Confirm whether you already have a mannequin concept, reference sheet, or existing Blender base mesh.

### Shared responsibilities

- Decide what "believable mannequin" means for version one.
- Decide which garment silhouette is first.
- Decide whether pattern generation is included in MVP or split into a second milestone.

### Exit criteria

- We have agreed schemas.
- We have agreed MVP scope.
- We have agreed supported ranges.
- We have a written list of deferred features.

### Phase 0 decisions already made

- User tiers are:
  - hobbyist/free
  - tailor/low-tier paid
  - designer or pro/high-tier paid
- Hobbyist/free constraints currently assumed:
  - one saved mannequin profile
  - maximum of two lifetime size changes on that mannequin profile
- Tailor constraints currently assumed:
  - multiple mannequin or client profiles
  - no custom designer-level garment features such as bespoke neckline design tools
- Designer or pro constraints currently assumed:
  - full feature access
- The first internal milestone includes:
  - mannequin
  - one garment-preview workflow
  - fabric preview
- There is no existing Blender mesh yet.

### Blender dependency note

The lack of an existing Blender mannequin does not block Phase 0 or most of Phase 1.

We can and should complete these before the mannequin asset exists:

- product contract
- schemas
- package boundaries
- app shell
- measurement validation
- viewer scaffolding
- profile and entitlement design

What does depend on the Blender asset is:

- realistic browser-side mannequin deformation
- morph-target integration
- final garment fit tuning against the body

So the correct sequencing is to lay the software blocks first, then begin asset creation in parallel, then join them in Phase 2 and Phase 3.

## Phase 1: Repository and App Foundation

### Goal

Set up the software harness before deep 3D or drafting logic begins.

### My responsibilities

- Scaffold the app structure.
- Set up TypeScript, linting, shared types, and validation.
- Create the initial 3D scene shell in the web app.
- Separate domain logic from UI and viewer code.
- Create placeholders for models, textures, and generated exports.
- Add documentation for asset placement and naming.

### Your responsibilities

- Confirm Blender version.
- Confirm export format preference, expected to be `.glb`.
- Confirm whether source `.blend` files should live inside the repo or outside it.
- Surface any machine or tool limitations before asset work starts.

### Shared responsibilities

- Finalize folder structure for source assets versus exported assets.
- Agree on naming conventions for mannequin source, morph variants, and garment previews.

### Exit criteria

- Repo layout is stable enough for work to proceed.
- The web app can host a 3D scene and load an external asset path.
- Asset directories and naming rules are documented.

## Phase 2: Blender Mannequin Asset Preparation

### Goal

Create one reliable mannequin asset pipeline that can support browser morphing.

### My responsibilities

- Define the exact morph-target list for the first prototype.
- Write a Blender preparation checklist.
- Specify which dimensions are handled by morphs versus which should later use bones or segmented scaling.
- Define export rules so the browser code can rely on stable mesh names and morph target names.
- Review each exported version for technical consistency.

### Your responsibilities

- In Blender, create or refine the neutral base mannequin.
- Produce the first required shape variations with consistent topology.
- Maintain identical vertex count across the morph target set.
- Export the `.glb` test asset.
- Report any Blender constraints that prevent clean morph preparation.

### Shared responsibilities

- Decide the first morph targets, likely:
  - bust
  - waist
  - hips
  - shoulder width
  - torso length
  - arm length
  - leg length
- Decide whether height is represented initially as a simplified control or broken into segments immediately.
- Review whether the body still looks anatomically acceptable at the ends of the supported range.

### Blender guidance loop

This phase will likely involve repeated "you operate, I direct" cycles for:

- Shape-key setup
- Naming cleanup
- Export cleanup
- Material simplification
- Topology consistency checks

### Exit criteria

- One `.glb` mannequin loads successfully.
- Morph targets are named predictably.
- The asset behaves consistently in the browser.
- We know which measurements the first model can represent credibly.

## Phase 3: 3D Mannequin Playground

### Goal

Deliver the first convincing proof: a measurement form controls a faceless 3D mannequin in the browser.

### My responsibilities

- Build the measurement form.
- Add Zod validation and unit support.
- Load the mannequin asset in React Three Fiber.
- Wire normalized inputs to morph target influences.
- Add orbit controls and front/side/back views.
- Add reset and save-profile hooks.
- Document how measurements map to morph weights.

### Your responsibilities

- Validate whether the visual response of each measurement feels plausible.
- Flag where morph behavior distorts anatomy or looks unconvincing.
- Provide revised exports if the asset needs correction.

### Shared responsibilities

- Tune the measurement-to-morph mapping.
- Decide whether any slider should be hidden because the body response is not reliable enough yet.
- Confirm the first set of editable measurements.

### Exit criteria

- Numeric input changes produce immediate mannequin updates.
- The first measurement form is stable.
- We have one demonstrable browser-based mannequin playground.

## Phase 4: Profiles, Persistence, and Client Management

### Goal

Turn the mannequin playground into a useful tool by saving real profiles and measurement histories.

### My responsibilities

- Add authentication and profile persistence.
- Build profile CRUD.
- Add support for one free profile and multi-profile paid logic later.
- Store raw measurements as the source of truth.
- Add measurement history/versioning scaffolding.

### Your responsibilities

- Confirm the real workflow a tailor or designer would expect for naming and managing clients.
- Review whether the measurement form is practically usable.
- Identify any missing high-priority fields.

### Shared responsibilities

- Decide which measurements are mandatory in MVP.
- Decide what profile metadata matters in the first version.

### Exit criteria

- Profiles save and reload correctly.
- Stored measurements regenerate mannequin state.
- The app starts to feel like a real dress-form tool rather than a demo.

## Phase 5: First Garment Preview

### Goal

Add one limited garment-preview experience without attempting full pattern-based generation.

### My responsibilities

- Define the first garment schema subset.
- Implement UI controls for the selected garment options.
- Integrate one premade garment mesh or parameterized garment setup.
- Wire garment state to mannequin state where feasible.
- Add color and simple texture application.

### Your responsibilities

- In Blender, prepare the first garment asset or garment variants.
- Ensure the garment fits the mannequin baseline well enough for prototype use.
- Provide corrected exports if clipping or proportion problems appear.
- Help judge which silhouette is most achievable for the first pass.

### Shared responsibilities

- Choose the first garment.
- Decide which options are real controls versus fixed presets.
- Decide how much fit variation is acceptable before reworking the asset.

### Blender-guided work likely needed

- Garment fit tuning around the mannequin
- Export setup for garment meshes
- Material slots for texture application
- Scale and transform normalization

### Exit criteria

- One garment can be previewed on the mannequin.
- Basic garment options work.
- The preview is useful enough to show the product direction.

## Phase 6: Fabric Photo and Texture Prototype

### Goal

Allow a user to upload a fabric image and see a believable first-pass texture on the garment.

### My responsibilities

- Build the upload and processing flow.
- Add basic crop, rotate, and repeat controls.
- Implement texture application in the viewer.
- Represent visual fabric settings separately from physical simulation settings.
- Add the first `FabricDefinition` fields and presets.

### Your responsibilities

- Provide test fabric photos.
- Evaluate whether scale, repeat, and visual application look believable.
- Identify typical fabric-photo problems from a real user perspective.

### Shared responsibilities

- Decide which calibration approach we require, if any.
- Decide which preset fabrics are included first.
- Decide whether the first version is manual repeat alignment only.

### Exit criteria

- Uploaded fabric textures can be applied to the garment.
- Repeat and scale controls exist.
- We have a clear separation between visual fabric appearance and future physics behavior.

## Phase 7: Pattern Engine Foundation

### Goal

Start the deterministic pattern track as a separate, testable subsystem.

### My responsibilities

- Create the `pattern-engine` package or equivalent module boundary.
- Define core geometry types such as points, lines, curves, notches, labels, and pattern pieces.
- Implement the first block-drafting scaffolding for a basic sleeveless bodice.
- Keep transformation logic separate from base drafting logic.
- Build SVG output for preview.

### Your responsibilities

- Help validate whether the chosen drafting assumptions match practical tailoring expectations.
- Provide reference examples if available.
- Flag any unrealistic assumptions before they harden into code.

### Shared responsibilities

- Choose the initial drafting methodology.
- Decide which formula sources are acceptable to encode.
- Decide which measurements are required for the first block.

### Exit criteria

- The pattern engine has a stable domain model.
- One basic bodice block can be generated in a reviewable form.
- The drafting layer is separate from the 3D layer.

## Phase 8: Pattern Validation and Transformation Rules

### Goal

Make the pattern system trustworthy enough to extend.

### My responsibilities

- Implement pattern validation checks.
- Add seam-length mismatch checks, invalid-curve checks, and basic piece integrity checks.
- Build transformation primitives such as dart rotation and flare addition as separate operations.
- Add tests using known examples where possible.

### Your responsibilities

- Review validation results against actual tailoring expectations.
- Confirm whether warnings and failures are practically useful.
- Identify any high-value alteration rules for early support.

### Shared responsibilities

- Decide which validation failures block export.
- Decide which transformations are most important after the base bodice.

### Exit criteria

- Pattern generation is not just producing geometry, it is checking itself.
- At least one transformation pipeline works on top of the base block.

## Phase 9: AI Interface Layer

### Goal

Add AI only after body, garment, and pattern schemas are stable enough to constrain it.

### My responsibilities

- Define JSON-schema-backed AI output contracts.
- Implement prompt and validation flow for natural-language-to-garment settings.
- Reject unsupported or invalid AI outputs.
- Keep the AI layer as an interpreter over deterministic systems.

### Your responsibilities

- Evaluate whether the AI interpretations are practically useful.
- Help identify language users are likely to use in fashion descriptions.
- Flag unsupported descriptions that should be made explicit in UX.

### Shared responsibilities

- Decide what design language the first AI release supports.
- Decide how the app explains unsupported features.

### Exit criteria

- AI can convert a design description into valid structured settings.
- Deterministic code remains the authority.

## Phase 10: Pattern-to-3D Connection

### Goal

Begin bridging 2D pattern logic and 3D garment logic without promising full real-time cloth simulation too early.

### My responsibilities

- Define seam connection data structures.
- Explore static or semi-static garment generation from pattern pieces.
- Integrate intermediate fidelity before advanced fidelity.
- Keep the generated-preview pipeline separate from the final pattern-print pipeline.

### Your responsibilities

- Help validate whether generated shapes remain visually coherent.
- Use Blender when we need to inspect or compare 3D garment behavior offline.

### Shared responsibilities

- Decide when to stop at intermediate fidelity versus investing in deeper simulation.
- Decide whether the product is already valuable before true pattern-to-cloth generation is solved.

### Exit criteria

- We have a clear bridge strategy from deterministic pattern data to 3D garment preview.
- We do not confuse future simulation ambitions with current product readiness.

## Deferred or Later-Stage Features

These are valid product directions from the notes, but should not be allowed to derail setup:

- Full automatic pattern drafting across many garment families
- Accurate cloth simulation driven by detailed physical fabric properties
- Yardage calculator
- Notions list generation
- Sewing-order generation
- AI pattern checker for user-uploaded patterns
- Alteration mode across all garment types
- Sketch and reference-image interpretation
- Mobile app

Some of these may start as design docs before they become implementation work.

## Immediate Build Order Recommendation

If we want the cleanest path with the least guessing, the actual execution order should be:

1. Lock schemas and MVP scope.
2. Set up the repo and app shell.
3. Prepare the mannequin in Blender.
4. Build the browser-based mannequin playground.
5. Add saved profiles and persistence.
6. Add one garment preview.
7. Add fabric-photo visualization.
8. Start the deterministic pattern engine as a separate workstream.
9. Add AI only after schema stability.

## What Will Need Close Collaboration Early

These are the places where we should expect back-and-forth rather than one-pass delivery:

- Defining the first supported body range
- Deciding which mannequin proportions are acceptable
- Preparing morph targets in Blender
- Tuning measurement-to-morph mapping
- Choosing the first garment silhouette
- Deciding the first drafting methodology
- Reviewing whether browser results match tailoring expectations

## What Could Skew the Plan If We Ignore It

- Trying to solve cloth simulation too early
- Letting AI define geometry instead of structured settings
- Treating body dimensions as totally independent sliders
- Expanding body support ranges before the mannequin logic is stable
- Starting pattern generation before agreeing on a drafting system
- Adding too many garments before one works end to end

## Next Practical Step

The next concrete step should be Phase 0 implementation:

1. I turn the saved notes into canonical TypeScript schemas and a repo structure proposal.
2. We confirm the exact MVP boundary.
3. I then set up the app shell and the first mannequin integration target while you prepare the first Blender mannequin asset.
