# Phase 1 Foundation

## Objective

Phase 1 establishes the repository and application foundation required before Blender asset integration and mannequin morph wiring begin.

## Decisions encoded in this phase

- The repo is now structured as an npm workspaces monorepo.
- Shared domain contracts live in `packages/`.
- The first application shell lives in `apps/web`.
- The web app is the first delivery surface.
- The mannequin asset path is reserved at `apps/web/public/models/mannequin.glb`.

## What this phase is intended to unblock

- Web UI scaffolding
- Shared TypeScript imports across app and packages
- Measurement validation and viewer integration
- Later garment and fabric controls
- Future API and worker app addition without repo reshaping

## What this phase does not complete

- Dependency installation
- Running Next.js locally
- 3D scene implementation
- Blender asset integration
- Authentication
- Persistence

## Next technical target

Phase 2 should define the Blender mannequin preparation checklist and the web-side mannequin integration boundary in more detail.
