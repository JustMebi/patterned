import { z } from "zod";

export const mannequinMorphTargetNames = [
  "bust",
  "waist",
  "fullHip",
  "shoulderWidth",
  "torsoLength",
  "armLength",
  "legLength",
] as const;

export type MannequinMorphTargetName =
  (typeof mannequinMorphTargetNames)[number];

export const mannequinAssetManifestSchema = z.object({
  assetVersion: z.string().min(1),
  meshName: z.string().min(1),
  materialNames: z.array(z.string().min(1)),
  morphTargets: z.array(z.enum(mannequinMorphTargetNames)).length(
    mannequinMorphTargetNames.length,
  ),
  unit: z.literal("meters"),
  upAxis: z.literal("Y"),
  forwardAxis: z.literal("-Z"),
  notes: z.array(z.string()),
});

export type MannequinAssetManifest = z.infer<
  typeof mannequinAssetManifestSchema
>;

export const mannequinAssetManifestTemplate: MannequinAssetManifest = {
  assetVersion: "v0",
  meshName: "Mannequin_Body",
  materialNames: ["Mannequin_Default"],
  morphTargets: [...mannequinMorphTargetNames],
  unit: "meters",
  upAxis: "Y",
  forwardAxis: "-Z",
  notes: [
    "All morph targets must preserve identical topology and vertex order.",
    "The exported mannequin should be faceless and production-neutral for the first prototype.",
  ],
};

export const measurementToMorphBindings = {
  bust: ["bust"],
  waist: ["waist"],
  fullHip: ["fullHip"],
  shoulderWidth: ["shoulderWidth"],
  frontWaistLength: ["torsoLength"],
  backWaistLength: ["torsoLength"],
  armLength: ["armLength"],
  inseam: ["legLength"],
} as const;
