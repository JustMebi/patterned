import { z } from "zod";

export const fabricPresetSchema = z.enum([
  "chiffon",
  "organza",
  "cotton",
  "ankara",
  "crepe",
  "satin",
  "duchessSatin",
  "denim",
  "lace",
  "stretchJersey",
]);

export const stretchTypeSchema = z.enum(["none", "twoWay", "fourWay"]);
export const finishSchema = z.enum(["matte", "balanced", "shiny"]);
export const opacitySchema = z.enum(["opaque", "semiSheer", "sheer"]);

export const fabricVisualSettingsSchema = z.object({
  scale: z.number().finite().min(0.1).max(10),
  repeatX: z.number().finite().min(0.1).max(20),
  repeatY: z.number().finite().min(0.1).max(20),
  rotationDeg: z.number().finite().min(-180).max(180),
  finish: finishSchema,
  opacity: opacitySchema,
});

export const fabricPhysicsPresetSchema = z.object({
  weightClass: z.enum(["light", "medium", "heavy"]),
  stretch: stretchTypeSchema,
  stiffness: z.enum(["soft", "balanced", "stiff"]),
});

export const fabricDefinitionSchema = z.object({
  name: z.string().min(1).max(100),
  preset: fabricPresetSchema,
  sourceImageUrl: z.string().url().optional(),
  processedTextureUrl: z.string().url().optional(),
  visual: fabricVisualSettingsSchema,
  physicsPreset: fabricPhysicsPresetSchema,
});

export type FabricDefinition = z.infer<typeof fabricDefinitionSchema>;

export const defaultFabricDefinition: FabricDefinition = {
  name: "Default Cotton",
  preset: "cotton",
  visual: {
    scale: 1,
    repeatX: 1,
    repeatY: 1,
    rotationDeg: 0,
    finish: "balanced",
    opacity: "opaque",
  },
  physicsPreset: {
    weightClass: "medium",
    stretch: "none",
    stiffness: "balanced",
  },
};
