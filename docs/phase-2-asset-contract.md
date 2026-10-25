# Phase 2 Mannequin Asset Contract

## Purpose

This document is the code-facing contract for the first browser mannequin asset.

## Export target

`apps/web/public/models/mannequin.glb`

## Required object name

`Mannequin_Body`

## Required material name

`Mannequin_Default`

## Required morph targets

- `bust`
- `waist`
- `fullHip`
- `shoulderWidth`
- `torsoLength`
- `armLength`
- `legLength`

## Measurement bindings for the first prototype

- `bust` measurement -> `bust`
- `waist` measurement -> `waist`
- `fullHip` measurement -> `fullHip`
- `shoulderWidth` measurement -> `shoulderWidth`
- `frontWaistLength` and `backWaistLength` -> `torsoLength`
- `armLength` -> `armLength`
- `inseam` -> `legLength`

## Deferred from the first mannequin contract

- separate height morph
- asymmetry
- facial detail
- rig-driven segmented proportions
- advanced materials
- garment fit shapes

## Code reference

The machine-readable contract lives in:

- `packages/measurement-engine/src/mannequin-contract.ts`
