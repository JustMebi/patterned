import { z } from "zod";

export const garmentCategorySchema = z.enum(["dress"]);
export const bodiceBlockSchema = z.enum(["darted", "princess", "corset", "loose"]);
export const necklineTypeSchema = z.enum([
  "round",
  "square",
  "boat",
  "sweetheart",
]);
export const sleeveTypeSchema = z.enum([
  "none",
  "basic",
  "puff",
  "bishop",
  "flutter",
]);
export const skirtTypeSchema = z.enum([
  "pencil",
  "aline",
  "circle",
  "mermaid",
]);
export const closureTypeSchema = z.enum(["zipper", "buttons", "elastic", "none"]);
export const closurePositionSchema = z.enum(["back", "side", "front"]);
export const garmentFitSchema = z.enum(["fitted", "semiFitted", "loose"]);
export const dressLengthPresetSchema = z.enum([
  "mini",
  "knee",
  "midi",
  "tea",
  "floor",
  "custom",
]);

export const garmentDefinitionSchema = z.object({
  category: garmentCategorySchema,
  bodice: z.object({
    block: bodiceBlockSchema,
    fit: garmentFitSchema,
    neckline: z.object({
      type: necklineTypeSchema,
      depthCm: z.number().finite().min(0).max(40),
      widthCm: z.number().finite().min(0).max(40),
    }),
    easeCm: z.number().finite().min(0).max(20),
  }),
  sleeve: z.object({
    type: sleeveTypeSchema,
    lengthCm: z.number().finite().min(0).max(80),
    fullness: z.number().finite().min(0).max(5),
  }),
  skirt: z.object({
    type: skirtTypeSchema,
    lengthPreset: dressLengthPresetSchema,
    lengthCm: z.number().finite().min(20).max(180),
    flare: z.number().finite().min(0).max(5),
  }),
  closures: z.object({
    type: closureTypeSchema,
    position: closurePositionSchema,
  }),
});

export type GarmentDefinition = z.infer<typeof garmentDefinitionSchema>;

export const defaultGarmentDefinition: GarmentDefinition = {
  category: "dress",
  bodice: {
    block: "darted",
    fit: "fitted",
    neckline: {
      type: "round",
      depthCm: 10,
      widthCm: 16,
    },
    easeCm: 3,
  },
  sleeve: {
    type: "none",
    lengthCm: 0,
    fullness: 0,
  },
  skirt: {
    type: "pencil",
    lengthPreset: "knee",
    lengthCm: 65,
    flare: 0,
  },
  closures: {
    type: "zipper",
    position: "back",
  },
};
