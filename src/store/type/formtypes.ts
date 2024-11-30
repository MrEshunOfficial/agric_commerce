import { z } from 'zod';

// Existing enums from previous implementation
export const OwnershipStatus = {
  Owned: 'Owned',
  Leased: 'Leased',
  Rented: 'Rented',
  Communal: 'Communal'
} as const;

export const FarmType = {
  CropFarming: 'Crop Farming',
  LivestockFarming: 'Livestock Farming',
  Mixed: 'Mixed',
  Aquaculture: 'Aquaculture'
} as const;

export const CropFarmingType = {
  Mixed: 'Mixed',
  Arable: 'Arable', 
  Horticulture: 'Horticulture',
  Perennial: 'Perennial',
  Hydroponic: 'Hydroponic'
} as const;

export const LivestockType = {
  Mixed: 'Mixed',
  Dairy: 'Dairy',
  Poultry: 'Poultry',
  CattleRanching: 'Cattle Ranching',
  PigFarming: 'Pig Farming',
  Beekeeping: 'Beekeeping'
} as const;

export const ProductionScale = {
  Small: 'Small',
  Medium: 'Medium',
  Commercial: 'Commercial'
} as const;

export const Gender = {
  Male: 'Male',
  Female: 'Female',
  Other: 'Other',
  PreferNotToSay: 'Prefer Not to Say'
} as const;

// Type Definitions
export type OwnershipStatusType = keyof typeof OwnershipStatus;
export type FarmTypeType = keyof typeof FarmType;
export type CropFarmingTypeType = keyof typeof CropFarmingType;
export type LivestockTypeType = keyof typeof LivestockType;
export type ProductionScaleType = keyof typeof ProductionScale;
export type GenderType = keyof typeof Gender;

// Interfaces
export interface FarmProfileData {
  _id?: string;
  userId: string;
  farmName: string;
  farmLocation: string;
  nearbyLandmarks?: string[];
  gpsAddress?: string;
  farmSize: number; // in acres
  productionScale: ProductionScaleType;
  farmImages?: {
    url: string;
    fileName: string;
  }[];

  // 2. Farmer Owner Information
  ownershipStatus: OwnershipStatusType;
  fullName: string;
  contactPhone: string;
  contactEmail?: string;
  gender: GenderType;

  // 3. Farm Type
  farmType: FarmTypeType;
  cropFarmingType?: CropFarmingTypeType;
  livestockType?: LivestockTypeType;
  primaryCropsOrLivestock: string[];

  // 4. Groups and Cooperative Information
  belongsToCooperative: boolean;
  cooperativeName?: string;
  cooperativeExecutive?: {
    name: string;
    position: 'President' | 'Secretary';
    phone: string;
    email?: string;
  };
  agriculturalOfficer?: {
    name: string;
    phone: string;
    email?: string;
  };
}

// Zod Schemas for Validation
export const FarmProfileFormSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  farmName: z.string().min(2, "Farm name must be at least 2 characters"),
  farmLocation: z.string().min(5, "Farm location must be at least 5 characters"),
  nearbyLandmarks: z.array(z.string()).optional(),
  gpsAddress: z.string().optional(),
  farmSize: z.number().positive("Farm size must be a positive number"),
  productionScale: z.enum(Object.values(ProductionScale) as [ProductionScaleType, ...ProductionScaleType[]]),
  farmImages: z.array(
    z.object({
      url: z.string().url("Invalid image URL"),
      fileName: z.string().min(1, "File name is required")
    })
  ).optional(),

  // 2. Farmer Owner Information
  ownershipStatus: z.enum(Object.values(OwnershipStatus) as [OwnershipStatusType, ...OwnershipStatusType[]]),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  contactPhone: z.string().min(10, "Phone number is required"),
  contactEmail: z.string().email().optional(),
  gender: z.enum(Object.values(Gender) as [GenderType, ...GenderType[]]),

  // 3. Farm Type
  farmType: z.enum(Object.values(FarmType) as [FarmTypeType, ...FarmTypeType[]]),
  cropFarmingType: z.enum(Object.values(CropFarmingType) as [CropFarmingTypeType, ...CropFarmingTypeType[]]).optional(),
  livestockType: z.enum(Object.values(LivestockType) as [LivestockTypeType, ...LivestockTypeType[]]).optional(),
  primaryCropsOrLivestock: z.array(z.string()).min(1, "At least one crop or livestock type must be specified"),

  // 4. Groups and Cooperative Information
  belongsToCooperative: z.boolean(),
  cooperativeName: z.string().optional(),
  cooperativeExecutive: z.object({
    name: z.string().min(2, "Executive name is required"),
    position: z.enum(['President', 'Secretary']),
    phone: z.string().min(10, "Phone number is required"),
    email: z.string().email().optional()
  }).optional(),
  agriculturalOfficer: z.object({
    name: z.string().min(2, "Agricultural officer name is required"),
    phone: z.string().min(10, "Phone number is required"),
    email: z.string().email().optional()
  }).optional()
}).superRefine((data, ctx) => {
  // Conditional Validations
  
  // Cooperative Information Validation
  if (data.belongsToCooperative) {
    if (!data.cooperativeName) {
      ctx.addIssue({
        code: "custom",
        message: "Cooperative name is required if belonging to a cooperative",
        path: ["cooperativeName"]
      });
    }
    if (!data.cooperativeExecutive) {
      ctx.addIssue({
        code: "custom",
        message: "Cooperative executive details are required if belonging to a cooperative",
        path: ["cooperativeExecutive"]
      });
    }
  }

  // Farm Type Specific Validations
  if (data.farmType === "CropFarming" && !data.cropFarmingType) {
    ctx.addIssue({
      code: "custom",
      message: "Crop farming type must be specified for crop farming",
      path: ["cropFarmingType"]
    });
  }

  if (data.farmType === "LivestockFarming" && !data.livestockType) {
    ctx.addIssue({
      code: "custom",
      message: "Livestock type must be specified for livestock farming",
      path: ["livestockType"]
    });
  }

  // Contact Information Validation
  if (!data.contactPhone && !data.contactEmail) {
    ctx.addIssue({
      code: "custom",
      message: "At least one contact method (phone or email) is required",
      path: ["contactInformation"]
    });
  }
});

// Validation Function
// Validation Function remains the same
export function validateFarmProfileForm(data: unknown): FarmProfileData {
  try {
    return FarmProfileFormSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      throw new Error(JSON.stringify(formattedErrors));
    }
    throw error;
  }
}