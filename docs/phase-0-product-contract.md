# Phase 0 Product Contract

## Purpose

This document locks the first implementation contract for Patterned so that Phase 1 can begin without guessing at scope, entitlement rules, or foundational data structures.

## Internal Milestones

Milestones here are internal build checkpoints, not public shipping stages.

The fact that you do not intend to ship early does not remove the need for milestones. We still need them to prevent architecture drift and to know when one subsystem is good enough to support the next.

For this project, milestones mean:

1. A subsystem has a defined scope.
2. It has acceptance criteria.
3. It is stable enough to become a dependency for the next subsystem.

## Product Tiers

### Hobbyist / Free

- One saved mannequin profile.
- The mannequin remains editable during its initial setup period until the user explicitly locks it.
- After the mannequin is locked, the user gets one free correction window.
- After that correction window is used, the same profile gets two post-lock size revisions.
- No advanced professional workflow features.
- Intended as a constrained entry tier, not a full drafting environment.
- The size-change cap exists to discourage free-tier use as a rotating multi-client account.
- The correction window and limited post-lock revisions exist to handle input mistakes and real-life body changes without making the free tier useful as a disguised multi-client workflow.

### Tailor / Low-Tier Paid

- Multiple mannequin or client profiles.
- Professional client-management workflow.
- Access to standard garment workflows.
- No designer-level custom garment controls such as highly custom neckline authoring or equivalent advanced bespoke design controls in the early commercial model.

### Designer / Pro / High-Tier Paid

- Full feature access.
- Advanced garment configuration.
- Future access to the most capable drafting, alteration, and design-assistant workflows.

## MVP Boundary

The first internal product milestone includes:

1. A browser-based mannequin controlled by structured measurements.
2. One garment-preview workflow.
3. Fabric-preview support using uploaded fabric imagery or texture inputs.

The MVP does not require full automatic pattern generation, full cloth simulation, or full AI design interpretation on day one.

## Immediate Product Position

Patterned should currently be treated as:

1. A digital dress-form and client-measurement platform first.
2. A garment-preview tool second.
3. A deterministic pattern platform later.
4. An AI-assisted interface layer only after the internal schemas are stable.

## Canonical First-Version User Model

The first version must serve three distinct user intents:

1. Hobbyist users who want a constrained but impressive try-and-preview flow.
2. Tailors who need multiple measurement profiles and dependable client workflow.
3. Designers or pros who ultimately need broader garment configuration and advanced features.

That means entitlement logic is not a late concern. It is part of the domain model from the beginning.

## Canonical First-Version Body Rule

The stored source of truth is always measurement data, not the final deformed mesh.

This means:

- Mannequin state must be reproducible from measurements.
- Garment behavior must read structured body data, not only visual scene state.
- Profile edits must be auditable and versionable later.

## Supported Range Policy

We should not claim universal body support in version one.

The first supported operating range should be explicitly constrained and tested:

```ts
const supportedRanges = {
  heightCm: [145, 195],
  bustCm: [70, 130],
  waistCm: [55, 120],
  fullHipCm: [75, 140],
  shoulderWidthCm: [30, 55],
  armLengthCm: [45, 75],
  inseamCm: [60, 100],
};
```

These are implementation bounds, not a claim of perfect fit fidelity across the whole range. The mannequin must still be tested visually across this space before the range is treated as reliable.

## Canonical First-Version Measurements

The first contract should support these body measurements:

- unit
- height
- bust
- underBust
- waist
- highHip
- fullHip
- shoulderWidth
- backWidth
- frontWaistLength
- backWaistLength
- waistToHip
- neckCircumference
- armLength
- bicepCircumference
- wristCircumference
- thighCircumference
- inseam

The first visual mannequin controls will likely use only a subset of these immediately, but the schema should already include the broader measurement model.

## Canonical First-Version Garment Rule

The garment system must be driven by structured garment definitions, not hardcoded UI-only state and not free-form AI text.

The first garment feature set should be constrained enough that the UI, renderer, and later AI layer all speak the same language.

The initial supported garment should be one simple silhouette suitable for:

- mannequin fitting
- limited style controls
- texture preview

The chosen first candidate is:

- a basic fitted bodice plus straight skirt

## Canonical First-Version Fabric Rule

The first fabric-preview system is a visual system, not a physically accurate simulation system.

The first version should support:

- uploaded image or texture input
- crop
- rotate
- repeat
- scale
- finish controls such as matte versus shiny
- opacity controls such as opaque versus sheer

The first version should not promise laboratory-accurate drape inference from a single photograph.

## Non-Goals for the First Internal Milestone

These are explicitly out of scope for the first milestone even if they remain product goals:

- full automatic pattern generation across many garments
- true 2D-to-3D sewn cloth simulation
- production-accurate yardage calculation
- advanced notions list generation
- advanced sewing-order generation
- sketch-to-garment AI interpretation
- user-uploaded pattern AI checking
- mobile app delivery

## Blender Dependency Decision

There is no existing mannequin mesh.

This does not block Phase 0 or the non-asset parts of Phase 1.

We can build before the asset exists:

- schemas
- entitlement logic
- package boundaries
- viewer scaffolding
- measurement validation
- profile models
- garment and fabric contracts

The missing Blender asset becomes a hard dependency for:

- morph-target integration
- realistic mannequin updates
- garment fit validation against the body

So the correct approach is:

1. Lock the software contract now.
2. Build the software harness next.
3. Prepare the mannequin asset in parallel.
4. Integrate them once the asset exists.

## Package Boundary Proposal

The initial repo should grow toward this shape:

```text
apps/
  web/
  api/
  worker/
packages/
  garment-schema/
  measurement-engine/
  fabric-catalogue/
  entitlements/
  pattern-engine/
  shared-utils/
docs/
```

## Acceptance Criteria for Phase 0

Phase 0 is complete when:

1. Tier rules are written and stable enough to encode.
2. Core measurement, garment, and fabric schemas exist in TypeScript form.
3. The first supported range is documented.
4. MVP and non-goals are explicit.
5. The Blender dependency is correctly sequenced instead of treated as an immediate blocker.

## Open Questions To Resolve Soon

These do not block Phase 0 completion, but they should be answered before or during Phase 1:

1. Which garment is the exact first silhouette?
2. What is the first drafting methodology for the later pattern engine?
3. The hobbyist mannequin policy is now:
   - editable until locked
   - one free correction window after lock
   - two post-lock size revisions on the same saved profile
   This is intended to prevent free-tier multi-client reuse while still allowing limited genuine body updates.
4. Should tailors be able to export previews in the first commercial model?
5. Which features exactly count as designer-only custom features?
