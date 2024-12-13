import { z } from 'zod';

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
  Aquaculture: 'Aquaculture',
  Nursery: 'Nursery',
  Poultry: 'Poultry',
  Others: 'Others',
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
export type ProductionScaleType = keyof typeof ProductionScale;
export type GenderType = keyof typeof Gender;

// Interfaces
export interface FarmProfileData {
  _id: string;
  userId: string;
  
  // Additional Farm Details
  farmDescription?: string;
  farmFoundedYear?: number;
  totalLandArea?: number;
  irrigatedLandArea?: number;
  
  farmName: string;
  farmLocation: string;
  nearbyLandmarks?: string[];
  gpsAddress?: string;
  farmSize: number;
  productionScale: typeof ProductionScale[keyof typeof ProductionScale];
  farmImages?: Array<{
    url: string;
    fileName: string;
  }>;

  // 2. Farmer Owner Information
  ownershipStatus: typeof OwnershipStatus[keyof typeof OwnershipStatus];
  fullName: string;
  contactPhone: string;
  contactEmail?: string;
  gender: typeof Gender[keyof typeof Gender];
  
  // Additional Personal Details
  dateOfBirth?: string;
  educationLevel?: string;
  primaryOccupation?: string;

  // 3. Farm Type
  farmType: typeof FarmType[keyof typeof FarmType];
  cropsGrown?: string[];
  livestockProduced?: string[];
  mixedCropsGrown?: string[];
  aquacultureType?: string[];
  nurseryType?: string[];
  poultryType?: string[];
  othersType?: string[];

  primaryCrop?: string;
  primaryLivestock?: string;
  annualCropYield?: number;
  livestockCount?: number;

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

  // Additional Financial and Support Information
  primaryIncome?: string;
  secondaryIncome?: string;
  governmentSupport?: boolean;
  supportType?: string;
}

// Zod Schemas for Validation
export const FarmProfileFormSchema = z.object({
  userId: z.string(),
  
  // Optional Extended Information
  farmDescription: z.string().optional(),
  farmFoundedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  totalLandArea: z.number().positive().optional(),
  irrigatedLandArea: z.number().nonnegative().optional(),
  
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
  
  // Additional Personal Details
  dateOfBirth: z.string().optional(),
  educationLevel: z.string().optional(),
  primaryOccupation: z.string().optional(),

  // 3. Farm Type
  farmType: z.enum(Object.values(FarmType) as [FarmTypeType, ...FarmTypeType[]]),
  cropsGrown: z.array(z.string()).optional(),
  livestockProduced: z.array(z.string()).optional(),
  mixedCropsGrown: z.array(z.string()).optional(),
  aquacultureType: z.array(z.string()).optional(),
  nurseryType: z.array(z.string()).optional(),
  poultryType: z.array(z.string()).optional(),
  othersType: z.array(z.string()).optional(),

  // Expanded Crop and Livestock Information
  primaryCrop: z.string().optional(),
  primaryLivestock: z.string().optional(),
  annualCropYield: z.number().positive().optional(),
  livestockCount: z.number().nonnegative().optional(),

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
  }).optional(),

  // Additional Financial and Support Information
  primaryIncome: z.string().optional(),
  secondaryIncome: z.string().optional(),
  governmentSupport: z.boolean().optional(),
  supportType: z.string().optional()
}).superRefine((data, ctx) => {
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

  // Contact Information Validation
  if (!data.contactPhone && !data.contactEmail) {
    ctx.addIssue({
      code: "custom",
      message: "At least one contact method (phone or email) is required",
      path: ["contactInformation"]
    });
  }
});