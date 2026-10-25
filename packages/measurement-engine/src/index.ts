import { z } from "zod";
export * from "./mannequin-contract";

export const measurementUnitSchema = z.enum(["cm", "in"]);

export const supportedMeasurementRangesCm = {
  height: { min: 145, max: 195 },
  bust: { min: 70, max: 130 },
  underBust: { min: 60, max: 115 },
  waist: { min: 55, max: 120 },
  highHip: { min: 70, max: 135 },
  fullHip: { min: 75, max: 140 },
  shoulderWidth: { min: 30, max: 55 },
  backWidth: { min: 25, max: 50 },
  frontWaistLength: { min: 30, max: 55 },
  backWaistLength: { min: 30, max: 55 },
  waistToHip: { min: 12, max: 30 },
  neckCircumference: { min: 25, max: 50 },
  armLength: { min: 45, max: 75 },
  bicepCircumference: { min: 18, max: 55 },
  wristCircumference: { min: 12, max: 25 },
  thighCircumference: { min: 35, max: 85 },
  inseam: { min: 60, max: 100 },
} as const;

const cmMeasurement = (range: { min: number; max: number }) =>
  z.number().finite().min(range.min).max(range.max);

export const bodyMeasurementsSchema = z.object({
  unit: measurementUnitSchema,
  height: cmMeasurement(supportedMeasurementRangesCm.height),
  bust: cmMeasurement(supportedMeasurementRangesCm.bust),
  underBust: cmMeasurement(supportedMeasurementRangesCm.underBust),
  waist: cmMeasurement(supportedMeasurementRangesCm.waist),
  highHip: cmMeasurement(supportedMeasurementRangesCm.highHip),
  fullHip: cmMeasurement(supportedMeasurementRangesCm.fullHip),
  shoulderWidth: cmMeasurement(supportedMeasurementRangesCm.shoulderWidth),
  backWidth: cmMeasurement(supportedMeasurementRangesCm.backWidth),
  frontWaistLength: cmMeasurement(supportedMeasurementRangesCm.frontWaistLength),
  backWaistLength: cmMeasurement(supportedMeasurementRangesCm.backWaistLength),
  waistToHip: cmMeasurement(supportedMeasurementRangesCm.waistToHip),
  neckCircumference: cmMeasurement(supportedMeasurementRangesCm.neckCircumference),
  armLength: cmMeasurement(supportedMeasurementRangesCm.armLength),
  bicepCircumference: cmMeasurement(supportedMeasurementRangesCm.bicepCircumference),
  wristCircumference: cmMeasurement(supportedMeasurementRangesCm.wristCircumference),
  thighCircumference: cmMeasurement(supportedMeasurementRangesCm.thighCircumference),
  inseam: cmMeasurement(supportedMeasurementRangesCm.inseam),
});

export type MeasurementUnit = z.infer<typeof measurementUnitSchema>;
export type BodyMeasurements = z.infer<typeof bodyMeasurementsSchema>;

export const mannequinControlMeasurementKeys = [
  "height",
  "bust",
  "waist",
  "fullHip",
  "shoulderWidth",
  "frontWaistLength",
  "armLength",
  "inseam",
] as const;

export type MannequinControlMeasurementKey =
  (typeof mannequinControlMeasurementKeys)[number];

export const defaultBodyMeasurementsCm: BodyMeasurements = {
  unit: "cm",
  height: 168,
  bust: 90,
  underBust: 78,
  waist: 72,
  highHip: 89,
  fullHip: 98,
  shoulderWidth: 38,
  backWidth: 36,
  frontWaistLength: 42,
  backWaistLength: 41,
  waistToHip: 20,
  neckCircumference: 34,
  armLength: 58,
  bicepCircumference: 28,
  wristCircumference: 16,
  thighCircumference: 55,
  inseam: 78,
};
