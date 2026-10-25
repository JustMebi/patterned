import { z } from "zod";

export const subscriptionTierSchema = z.enum(["hobbyist", "tailor", "designerPro"]);

export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;

export type TierEntitlements = {
  maxSavedProfiles: number | null;
  requiresExplicitProfileLock: boolean;
  includesPostLockCorrectionWindow: boolean;
  maxPostLockSizeRevisionsPerProfile: number | null;
  allowsAdvancedCustomGarmentFeatures: boolean;
  allowsMultipleClientProfiles: boolean;
  notes: string[];
};

export const tierEntitlements: Record<SubscriptionTier, TierEntitlements> = {
  hobbyist: {
    maxSavedProfiles: 1,
    requiresExplicitProfileLock: true,
    includesPostLockCorrectionWindow: true,
    maxPostLockSizeRevisionsPerProfile: 2,
    allowsAdvancedCustomGarmentFeatures: false,
    allowsMultipleClientProfiles: false,
    notes: [
      "Entry tier intended for constrained mannequin and preview usage.",
      "The saved mannequin stays editable until the user explicitly locks it.",
      "After lock, the profile gets one correction window and then two post-lock size revisions.",
    ],
  },
  tailor: {
    maxSavedProfiles: null,
    requiresExplicitProfileLock: false,
    includesPostLockCorrectionWindow: false,
    maxPostLockSizeRevisionsPerProfile: null,
    allowsAdvancedCustomGarmentFeatures: false,
    allowsMultipleClientProfiles: true,
    notes: [
      "Tailor tier supports multiple client profiles.",
      "Designer-level bespoke feature access is intentionally restricted.",
    ],
  },
  designerPro: {
    maxSavedProfiles: null,
    requiresExplicitProfileLock: false,
    includesPostLockCorrectionWindow: false,
    maxPostLockSizeRevisionsPerProfile: null,
    allowsAdvancedCustomGarmentFeatures: true,
    allowsMultipleClientProfiles: true,
    notes: ["Highest tier intended to unlock the full product feature set."],
  },
};
