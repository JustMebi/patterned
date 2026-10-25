You should **not begin by asking AI to build the complete fashion platform**, and you should not begin with full cloth simulation or automatic pattern drafting. Those are the two hardest parts of the system.

Begin with a narrow technical proof:

> A measurement form controls a faceless 3D mannequin in the browser.

Once that pipeline works, you can progressively attach garments, fabric textures, pattern rules and AI-assisted design.

# 1. The system’s major layers

Conceptually, the platform has about eight layers.

## Layer 1: User, client and measurement management

This is the ordinary application layer.

It handles:

- Registration and authentication
- Free and paid subscriptions
- Personal mannequin profiles
- Client profiles for professional tailors
- Measurement history
- Saved garments and patterns
- Fabric library
- Export history
- Permissions for fashion-house team members

A body profile might initially look like this:

```ts
type BodyMeasurements = {
  unit: "cm" | "in";
  height: number;
  bust: number;
  underBust: number;
  waist: number;
  highHip: number;
  fullHip: number;
  shoulderWidth: number;
  backWidth: number;
  frontWaistLength: number;
  backWaistLength: number;
  waistToHip: number;
  neckCircumference: number;
  armLength: number;
  bicepCircumference: number;
  wristCircumference: number;
  thighCircumference: number;
  inseam: number;
};
```

Do not store only the final 3D shape. Store the original measurements as the source of truth. The mannequin can always be regenerated from them.

You will also need:

- Validation ranges
- Unit conversion
- Measurement instructions
- Confidence flags
- Optional left/right asymmetry later
- Versioning when a client’s measurements change

Your database could be PostgreSQL, accessed through Supabase or a conventional backend.

---

# 2. The parametric mannequin layer

This is your first specialised layer.

The mannequin is not generated from nothing every time. You create one carefully prepared base mesh, then deform it according to measurement inputs.

## The practical approach: base mesh plus morph targets

In Blender, you make:

1. A neutral base mannequin
2. A larger-bust variation
3. A smaller-bust variation
4. A wider-waist variation
5. A narrower-waist variation
6. Wider and narrower hips
7. Longer and shorter torso
8. Wider and narrower shoulders
9. Longer and shorter arms
10. Longer and shorter legs

In Blender, these variations are usually implemented with **shape keys**. In web rendering, the equivalent concept is commonly called **morph targets**.

A morph target contains a variation of the same mesh. Your app controls how strongly each variation influences the mannequin. Babylon.js describes the resulting geometry as the original mesh plus the weighted differences from its morph targets; the targets must preserve the same vertex count as the original mesh. ([Babylon.js Docs][1])

For example:

```ts
const influences = {
  bust: 0.35,
  waist: -0.18,
  hips: 0.52,
  shoulderWidth: -0.08,
  torsoLength: 0.21,
};
```

These are not the user’s actual measurements. They are normalized values calculated from the measurements.

For example:

```ts
function normalizeMeasurement(
  value: number,
  base: number,
  minimum: number,
  maximum: number,
) {
  if (value >= base) {
    return (value - base) / (maximum - base);
  }

  return -((base - value) / (base - minimum));
}
```

You would then map the result to corresponding morph-target weights.

## The important limitation

Bust, waist and hips are not fully independent.

Increasing the bust may affect:

- Chest depth
- Upper-back shape
- Under-bust contour
- Front waist length
- Shoulder-to-bust distance

Similarly, increasing the hips might affect:

- Seat projection
- Upper-thigh circumference
- Waist-to-hip transition
- Centre-back shape

Therefore, the final mannequin cannot be a collection of completely isolated sliders. You need a **body-shape solver** that combines measurements while enforcing anatomical constraints.

For the first prototype, approximate this. Do not try to solve every possible human body.

Start with:

- Height
- Bust
- Waist
- Hip
- Shoulder width
- Torso length
- Arm length
- Leg length

That is sufficient to prove the interaction.

## Height should not be one global scale

Do not simply stretch the entire mannequin upward. Two people of the same height may have different torso and leg proportions.

Break height into segments:

```ts
type VerticalProportions = {
  headAndNeck: number;
  shoulderToWaist: number;
  waistToHip: number;
  hipToKnee: number;
  kneeToFloor: number;
};
```

Use bones or controlled mesh regions for length changes and morph targets for circumference and shape changes.

## Recommended asset format

Export the mannequin from Blender as `.glb` or `.gltf`.

That gives you:

- Meshes
- Materials
- Skeletons
- Morph targets
- Animations
- Texture references

For the browser, either Three.js or Babylon.js can render the model. Three.js provides WebGL rendering and morph-target examples, while Babylon.js has direct documentation around morph-target management. ([Three.js][2])

My preference for your prototype would be:

- **React**
- **TypeScript**
- **React Three Fiber**
- **Three.js**
- Blender for asset preparation

React Three Fiber gives you a React-friendly layer over Three.js. The 3D engine should still be treated as its own module rather than mixed throughout the application UI.

---

# 3. The garment-definition layer

The garment cannot merely be a finished 3D dress model. It needs a structured definition.

For example:

```ts
type GarmentDefinition = {
  category: "dress";
  bodice: {
    block: "darted" | "princess" | "corset" | "loose";
    neckline: {
      type: "round" | "square" | "boat" | "sweetheart";
      depthCm: number;
      widthCm: number;
    };
    easeCm: number;
  };
  sleeve: {
    type: "none" | "basic" | "puff" | "bishop" | "flutter";
    lengthCm: number;
    fullness: number;
  };
  skirt: {
    type: "pencil" | "aline" | "circle" | "mermaid";
    lengthCm: number;
    flare: number;
  };
  closures: {
    type: "zipper" | "buttons" | "elastic" | "none";
    position: "back" | "side" | "front";
  };
};
```

This becomes the shared language of your whole platform.

The UI modifies it.

The AI produces it.

The drafting engine reads it.

The 3D viewer visualizes it.

The yardage calculator reads it.

The sewing-instruction system reads it.

This shared garment schema is one of the most important architectural decisions you will make.

Without it, the AI, patterns and 3D garments become separate systems that do not communicate cleanly.

---

# 4. The pattern-drafting engine

This is the true intellectual property of the product.

The drafting engine should be deterministic. It should not ask an AI model to invent pattern coordinates.

A language model can interpret:

> “Make the neckline slightly wider and lower, but keep it church appropriate.”

But a deterministic engine should calculate:

- Exact neckline coordinates
- Seam lengths
- Dart placement
- Sleeve-cap length
- Ease
- Seam allowance
- Notches
- Grainlines
- Cut quantities

## Think of each pattern as geometry plus rules

A bodice pattern may consist of:

```ts
type Point2D = {
  x: number;
  y: number;
};

type PatternPiece = {
  id: string;
  name: string;
  outline: CurveSegment[];
  internalLines: PatternLine[];
  notches: Notch[];
  grainline: Line;
  labels: PatternLabel[];
  cutQuantity: number;
  cutOnFold: boolean;
};
```

The underlying engine calculates points and curves.

For example, simplified pseudocode might be:

```ts
const quarterBust = bust / 4;
const bodyEase = 3;
const bodiceWidth = quarterBust + bodyEase / 4;

const armholeDepth = calculateArmholeDepth({
  bust,
  backWidth,
  shoulderWidth,
});

const waistSuppression = bodiceWidth - (waist / 4 + waistEase / 4);

const dartIntake = distributeWaistSuppression(
  waistSuppression,
  selectedDartConfiguration,
);
```

The real formulas will depend on the drafting system you choose.

You need to decide whether your initial drafting methodology is based on:

- Metric pattern cutting
- A recognised block-drafting method
- Your own tested rules
- A hybrid developed with experienced pattern cutters

Be careful about copying proprietary drafting systems directly. The mathematical principles of geometry are one matter; reproducing copyrighted instructional material, diagrams or branded drafting methods is another.

## Build the pattern engine incrementally

Do not start with every garment.

Start with one block:

### First block

A basic sleeveless bodice with:

- Bust dart
- Waist dart
- Round neckline
- Front and back
- Configurable ease
- Optional seam allowance

Then add:

1. Basic straight skirt
2. Basic sleeve
3. Dart manipulation
4. A-line transformation
5. Princess seams
6. Neckline variations
7. Sleeve variations
8. More complex skirts
9. Corsetry
10. Draping and asymmetric styles much later

## Pattern transformations should be separate from base drafting

For example:

```ts
const baseBodice = draftBasicBodice(measurements, ease);

const transformedBodice = rotateDart(baseBodice, {
  from: "waist",
  to: "side-seam",
});
```

That is better than independently drafting a new bodice for every dart type.

Your system should understand transformations such as:

- Slash and spread
- Pivoting darts
- Closing one dart and opening another
- Adding flare
- Splitting a piece along a style line
- Joining pieces
- Adding pleat intake
- Adding fullness
- Adding seam allowance

This gives you reusable fashion geometry rather than thousands of unrelated templates.

## Pattern rendering

For the first web version, render the 2D pattern using:

- SVG for editable previews
- Canvas for high-performance interactions where needed
- PDF generation for printing
- DXF export later for industrial workflows

SVG is particularly useful because a pattern is naturally made of paths, labels, lines and curves.

---

# 5. Connecting the 2D pattern to the 3D garment

This is the most important technical bridge.

The 3D dress should ideally be generated from the same 2D pattern pieces that the user will print.

The general process is:

1. Draft pattern pieces in 2D
2. Position them around the mannequin
3. Convert their boundaries to garment meshes
4. Define which pattern edges are sewn together
5. Run cloth simulation
6. Allow the fabric to settle on the mannequin
7. Display the result

A seam definition might look like:

```ts
type SeamConnection = {
  firstPieceId: string;
  firstEdgeId: string;
  secondPieceId: string;
  secondEdgeId: string;
  easing?: number;
};
```

This is substantially harder than attaching a premade dress model.

For your first version, do **not** attempt fully automatic 2D-to-3D sewing simulation.

Use staged fidelity.

### Prototype fidelity

Premade garment meshes that stretch with the mannequin.

### Intermediate fidelity

Parameterized garment meshes corresponding approximately to the selected options.

### Advanced fidelity

True pattern-generated cloth meshes stitched and simulated around the mannequin.

This keeps the project buildable.

---

# 6. Fabric scanning and texture processing

There are actually two different fabric systems:

## A. Visual appearance

This covers:

- Colour
- Print
- Pattern repeat
- Shine
- Transparency
- Surface texture
- Scale

A photo of the fabric becomes a texture.

Your processing pipeline could:

1. Ask the user to photograph the fabric flat
2. Include a known-size reference card
3. Detect and correct perspective
4. Crop the usable fabric area
5. Remove uneven lighting
6. Identify the repeating motif
7. Create a seamless tile
8. Estimate real-world motif size
9. Apply it to the garment’s UV map

Without a size reference, the application will not know whether a flower in the photograph is 2 cm or 20 cm wide.

You could ask users to place:

- A supplied printable calibration square
- A bank card
- A ruler

beside the fabric.

## B. Physical behaviour

This covers:

- Weight
- Thickness
- Stretch
- Shear
- Bend resistance
- Friction
- Drape
- Recovery
- Bias behaviour

“Lightweight, medium and heavy” is useful for ordinary users, but internally, your simulation will eventually require more precise properties.

```ts
type FabricPhysics = {
  weightGsm: number;
  thicknessMm: number;
  stretchWarpPercent: number;
  stretchWeftPercent: number;
  stretchBiasPercent: number;
  bendingStiffness: number;
  shearStiffness: number;
  friction: number;
  damping: number;
};
```

For the MVP, let users choose familiar presets:

- Chiffon
- Organza
- Cotton
- Ankara
- Crepe
- Satin
- Duchess satin
- Denim
- Lace
- Stretch jersey

Then expose simple modifiers:

- Lighter/heavier
- Softer/stiffer
- Non-stretch/two-way/four-way
- Matte/shiny
- Opaque/sheer

Do not promise laboratory-accurate simulation from a single photograph. A photograph may indicate colour and weave, but it cannot reliably reveal all the material’s physical properties.

Blender includes cloth simulation and supports shape keys in cloth-related workflows, making it useful for developing and validating fabric behaviour offline. ([Blender Documentation][3])

---

# 7. The AI layer

AI should sit **above** your deterministic systems, not replace them.

Its role is to translate natural human intention into structured commands.

For example, the user says:

> “I want a modest fitted midi dress with a square neckline, short puff sleeves and a slight A-line skirt.”

The AI returns:

```json
{
  "category": "dress",
  "bodice": {
    "block": "darted",
    "fit": "fitted",
    "neckline": {
      "type": "square",
      "depthCm": 11,
      "widthCm": 18
    }
  },
  "sleeve": {
    "type": "puff",
    "lengthCm": 24,
    "fullness": 1.4
  },
  "skirt": {
    "type": "aline",
    "lengthPreset": "midi",
    "flare": 0.25
  },
  "constraints": {
    "modesty": "high",
    "maximumNecklineDepthCm": 12
  }
}
```

Structured Outputs can constrain model responses to a supplied JSON Schema, which is valuable here because the output needs to be consumed by your garment engine rather than treated as free-form prose. ([OpenAI Developers][4])

The app then validates the response:

```ts
const result = GarmentDefinitionSchema.safeParse(aiResponse);

if (!result.success) {
  throw new InvalidGarmentDefinitionError(result.error);
}
```

## Useful AI responsibilities

AI can help with:

- Converting descriptions to garment settings
- Interpreting rough sketches
- Identifying garment features in reference images
- Suggesting compatible design options
- Explaining sewing steps
- Recommending corrections
- Converting “make it more dramatic” into proposed parameter changes
- Detecting impossible or risky design combinations
- Generating initial code and test cases during development

Modern multimodal models can accept images as input, so a sketch or garment reference can be analysed and translated into your internal schema. ([OpenAI Developers][5])

## AI should not be trusted to perform these directly

Do not let the AI independently decide:

- Exact pattern geometry
- Whether two seam lengths match
- Whether a sleeve cap will sew into an armhole
- Final yardage
- Final print scale
- Whether a garment will physically fit
- Whether a generated pattern is production-safe

Those should come from deterministic calculations and validation tests.

Think of AI as the interpreter and assistant. Your geometry engine is the authority.

---

# 8. The backend and infrastructure layer

For your technical background, I would use TypeScript across most of the product.

## Recommended initial stack

### Frontend

- React
- Next.js
- TypeScript
- React Three Fiber and Three.js
- SVG-based pattern editor
- Zustand for editor state
- TanStack Query for server state
- Zod for validation

### Backend

You have two sensible options.

#### Option A: Mostly TypeScript

- Node.js
- NestJS or Fastify
- PostgreSQL
- Prisma or Drizzle
- Redis for jobs and caching
- Object storage for `.glb`, textures, patterns and exports

This is easiest if you want one principal programming language.

#### Option B: TypeScript application plus Python geometry service

- Next.js frontend
- Node.js API gateway
- Python service for computational geometry, image processing and simulation
- PostgreSQL
- Redis
- Object storage

Python has strong geometry, scientific-computing and computer-vision ecosystems. However, it introduces another deployment unit.

My recommendation:

> Start fully in TypeScript. Introduce Python only when a particular geometry, image-processing or simulation task clearly benefits from it.

Do not adopt Python just because the product contains AI.

## Object storage

Do not put large 3D files or fabric photographs directly inside PostgreSQL.

Store them in object storage:

- Mannequin GLB files
- Uploaded fabric images
- Processed seamless textures
- Garment preview renders
- Pattern PDFs
- DXF files
- Thumbnail images

The database stores URLs, metadata, ownership and processing status.

## Background jobs

Some operations will be slow:

- Generating a high-resolution PDF
- Processing a fabric image
- Running a cloth simulation
- Creating thumbnails
- Exporting DXF
- Analysing a sketch

Put these into a job queue rather than holding open a normal HTTP request.

```ts
type DesignJob = {
  id: string;
  type:
    | "PROCESS_FABRIC"
    | "SIMULATE_GARMENT"
    | "EXPORT_PATTERN"
    | "ANALYSE_SKETCH";
  status: "queued" | "processing" | "completed" | "failed";
  inputAssetIds: string[];
  outputAssetIds: string[];
};
```

---

# 9. Website now, mobile application later

A web-first approach is appropriate because the pattern editor and 3D viewport benefit from a larger screen.

Do not assume that a React website can simply be transformed into a React Native application. You can share business logic, types, schemas, API clients and calculations, but most visual components will differ.

Structure the project as a monorepo:

```text
fashion-platform/
  apps/
    web/
    mobile/
    api/
    worker/
  packages/
    garment-schema/
    measurement-engine/
    pattern-engine/
    fabric-catalogue/
    api-client/
    design-system/
    shared-utils/
```

The reusable foundation should be:

- Domain models
- Measurement formulas
- Pattern geometry
- API contracts
- Validation schemas
- Subscription rules
- AI schemas
- Test fixtures

The browser-specific 3D renderer stays in the web application.

Later, the mobile application can:

- Manage client measurements
- Photograph fabrics
- Preview saved designs
- Adjust simple parameters
- Share client approvals

The full precision pattern editor may remain web or tablet-first.

You could also ship the website as a progressive web app before committing to a separate mobile application.

# 10. What you should build first

Here is the sequence I would genuinely recommend.

## Phase 0: Define the product’s internal language

Before coding, write three schemas:

1. `BodyMeasurements`
2. `GarmentDefinition`
3. `FabricDefinition`

Also define your initial supported ranges.

For example:

```ts
const supportedRanges = {
  heightCm: [145, 195],
  bustCm: [70, 130],
  waistCm: [55, 120],
  hipCm: [75, 140],
};
```

Do not say “all body types” in the first version. Choose a tested range and expand it.

## Phase 1: Build a 3D mannequin playground

The application should have:

- One mannequin
- Orbit controls
- Front, back and side views
- Colour selector
- Height, bust, waist and hip sliders
- Numeric measurement inputs
- Reset button
- Save profile button

The mannequin should update immediately.

This is the first convincing demonstration of the idea.

### How AI can help you begin

Do not give one huge prompt. Work in contained units.

A useful first AI instruction would be:

> Create a Next.js TypeScript application containing a React Three Fiber scene. Load a GLB mannequin from `/models/mannequin.glb`, add orbit controls, front/side/back camera presets, neutral lighting, a mannequin colour selector and sliders for four named morph targets: `height`, `bust`, `waist` and `hips`. Separate the 3D scene, controls and domain types. Validate measurement inputs with Zod. Do not generate placeholder 3D geometry for the final mannequin; assume the GLB will be supplied separately.

Notice that this prompt asks AI to build the **software harness**, not manufacture an anatomically reliable model.

You or a 3D artist must make the actual Blender asset.

## Phase 2: Add body profiles

Build:

- Authentication
- Database persistence
- One free profile
- Multiple premium profiles
- Profile duplication
- Measurement history
- Client labels

At this stage you already have a potentially useful fitting and client-management product.

## Phase 3: Add one premade garment

Choose one simple garment:

- Sleeveless fitted sheath dress, or
- Basic fitted bodice and straight skirt

It should:

- Follow the mannequin’s shape
- Change colour
- Accept an uploaded texture
- Allow fixed length options
- Support a small amount of ease

This is not yet generated from a sewing pattern. It is a visualization prototype.

## Phase 4: Fabric-photo prototype

Build:

- Fabric image upload
- Crop and rotate
- Perspective correction
- Pattern-scale control
- Repeat controls
- Texture application
- Matte-to-shiny slider
- Opaque-to-sheer slider

Initially, let users manually align the repeat. Automatic repeat detection can come later.

## Phase 5: First genuine pattern block

Create the basic sleeveless bodice in isolation.

Do not connect it to 3D yet.

Inputs:

- Bust
- Waist
- Back width
- Shoulder width
- Front waist length
- Back waist length
- Neck
- Dart position
- Ease

Output:

- Front SVG
- Back SVG
- Measurement labels
- Grainline
- Darts
- Seam allowance
- Tiled PDF

Test it against manually drafted examples.

This stage requires collaboration with an experienced pattern cutter.

## Phase 6: Pattern validation system

Every generated pattern should pass automated checks.

```ts
type PatternValidationResult = {
  valid: boolean;
  errors: PatternIssue[];
  warnings: PatternIssue[];
};

type PatternIssue = {
  code:
    | "SEAM_LENGTH_MISMATCH"
    | "INVALID_CURVE"
    | "PIECE_SELF_INTERSECTION"
    | "MISSING_GRAINLINE"
    | "DART_OUTSIDE_PIECE";
  message: string;
  pieceIds: string[];
};
```

Tests should verify:

- Matching seams have compatible lengths
- Curves do not self-intersect
- Darts stay inside pieces
- Seam allowances do not cross themselves
- Print dimensions remain correct
- Every required notch and grainline exists

## Phase 7: AI natural-language designer

Only after you have a real garment schema should you add:

> “Describe your design.”

The AI converts the description into valid garment settings.

It does not create arbitrary geometry. It chooses from capabilities already supported by the platform.

If the engine only supports round and square necklines, the AI must not quietly generate an unsupported sculptural neckline. It should either approximate it or clearly say that the feature is not yet available.

## Phase 8: Connect 2D blocks to 3D garments

Use the pattern pieces to generate garment meshes.

Start with static draping or server-generated simulation.

Later, add live simulation and more precise fabric behaviour.

## Phase 9: Sketch and reference-image interpretation

Once the platform has a reasonable catalogue of design features:

1. User uploads a sketch
2. Vision model identifies garment elements
3. AI maps them into `GarmentDefinition`
4. User reviews the interpretation
5. Engine generates the design
6. Unsupported portions are highlighted

This “review before generation” screen will be very important.

# 11. Should you use plugins or build from scratch?

Use existing technology for infrastructure and rendering. Build your differentiating logic.

## Do not build these from scratch

- 3D renderer
- Database
- Authentication
- Payment processing
- File storage
- PDF fundamentals
- Image-upload pipeline
- Basic cloth physics engine
- AI foundation model
- Camera controls
- General UI components

## You probably do need to own these

- Measurement model
- Measurement-to-body mapping
- Garment schema
- Pattern drafting rules
- Dart-transformation engine
- Pattern validation
- Pattern-to-3D seam mapping
- Fabric preset library
- Tailor-oriented workflows
- Nigerian/African garment conventions and terminology

The useful proprietary portion is not “displaying a mannequin in 3D.” Many engines can do that.

The hard and valuable part is:

> Turning real client measurements and fashion choices into a valid, editable, testable sewing pattern and a trustworthy preview.

# 12. How much can AI coding agents realistically do?

They can help create:

- Project structure
- Forms
- APIs
- Database schemas
- Three.js scene setup
- GLB loading
- Slider-to-morph wiring
- SVG utilities
- PDF export
- Image upload
- Authentication
- Tests
- Queue infrastructure
- AI request schemas

They cannot, without your direction, reliably invent:

- A production-quality mannequin
- Anatomically correct morph targets
- A complete pattern-cutting methodology
- Accurate cloth parameters
- Correct fit rules
- A sufficiently tested grading system

Those require domain expertise, reference data and physical testing.

Your best workflow is:

1. Specify one narrow capability.
2. Ask AI to implement it.
3. Inspect the architecture.
4. Run it.
5. Write or request tests.
6. Compare outputs against known examples.
7. Commit the working unit.
8. Move to the next capability.

Do not let the agent generate twenty intertwined features before you understand the first one.

# 13. Your most sensible MVP

I would define the first release as:

### Digital Mannequin and Design Preview

Users can:

- Create one or more client profiles
- Enter twelve to fifteen measurements
- View a morphing 3D mannequin
- Select one of perhaps five basic garment silhouettes
- Change neckline, sleeve and length options
- Upload a fabric photograph
- Apply the print to the garment
- Save and share a 360-degree preview
- Receive an estimated measurement summary

Pattern export would initially be marked as experimental or omitted entirely.

Then build a separate **Pattern Lab** around one rigorously tested bodice and skirt block.

That produces two manageable technical milestones rather than betting the entire product on solving parametric pattern drafting and cloth simulation immediately.

## The foundation in one diagram

```text
User interface
      │
      ▼
Garment + body + fabric schemas
      │
      ├───────────────┬─────────────────┐
      ▼               ▼                 ▼
Measurement      Pattern engine     AI interpreter
solver            deterministic      natural language
      │               │                 │
      ▼               ▼                 │
3D mannequin     2D pattern pieces ◄────┘
      │               │
      └───────┬───────┘
              ▼
       Garment mesh/seams
              │
              ▼
       Cloth/fabric simulation
              │
              ▼
      Preview and export layer
```

The first repository should therefore contain a well-organised React/TypeScript application and a properly prepared Blender mannequin with a small set of morph targets. It should **not** begin as an AI-generated end-to-end drafting platform.

[1]: https://doc.babylonjs.com/features/featuresDeepDive/mesh/morphTargets?utm_source=chatgpt.com "Morph Targets | Babylon.js Documentation"
[2]: https://threejs.org/docs/?utm_source=chatgpt.com "three.js docs"
[3]: https://docs.blender.org/manual/en/latest/physics/cloth/settings/shape.html?utm_source=chatgpt.com "Shape - Blender 5.1 Manual"
[4]: https://developers.openai.com/api/docs/guides/structured-outputs?utm_source=chatgpt.com "Structured model outputs | OpenAI API"
[5]: https://developers.openai.com/api/docs/guides/images-vision?utm_source=chatgpt.com "Images and vision | OpenAI API"

#14. Out of Scope

## Model in different poses

Each pose will be catered to the outfits restrictions.
For example: Dramatic back flare poses for loosely fitted outfits

There will be basic poses like:
-Hands on hips
-Peace sign

Maybe have categories like coperate poses: model on a chair legs crossed etc
