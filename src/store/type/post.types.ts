import { z } from 'zod';
export interface BaseMetadata {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductType {
  item: string;
  quantity: number;
  price: number;
  unit: string;
  status: boolean;
}

export interface HarvestDetailsType {
  harvest_ready: boolean;
  quantity?: number;
  unit?: string;
  harvest_date?: Date;
  quality_grade?: string;
}

export interface PricingType {
  negotiable: boolean;
  bulk_discount?: string;
}

export interface LogisticsType {
  delivery_available: boolean;
  delivery_condition: string;
  delivery_cost: string;
}

// Image Type to replace string-based image references
export interface ImageType {
  url: string;
  fileName?: string;
  file?: File;
}

export interface PostData extends BaseMetadata {
  userId: string;
  farmName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  farmLocation: string;
  farmType: string;
  cropFarmingType?: string;
  livestockType?: string;
  
  // Optional status flags
  pinned?: boolean;
  favorite?: boolean;
  wishlist?: boolean;

  product: ProductType;
  description: string;
  
  // Image handling
  add_images?: ImageType[];
  
  harvest_details: HarvestDetailsType;
  pricing: PricingType;
  logistics: LogisticsType;
  
  posted_at?: Date;
  tags?: string[];
}



// Zod Schemas with Comprehensive Validation
export const ImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  fileName: z.string().min(1, "File name is required")
})

export const ProductSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  quantity: z.number().nonnegative("Quantity cannot be negative"),
  price: z.number().positive("Price must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  status: z.boolean(),
});

export const HarvestDetailsSchema = z.object({
  harvest_ready: z.boolean(),
  quantity: z.number().nonnegative("Quantity cannot be negative").optional(),
  unit: z.string().optional(),
  harvest_date: z.union([z.string().transform((val) => new Date(val)), z.date()]).optional(),
  quality_grade: z.enum(
    ['A', 'B', 'C', 'Premium', 'Standard'],
    { message: 'Invalid quality grading' }
  ).default('Standard').optional(),
});

export const PricingSchema = z.object({
  negotiable: z.boolean(),
  bulk_discount: z.string().optional(),
});

export const LogisticsSchema = z.object({
  delivery_available: z.boolean(),
  delivery_condition: z.string().min(1, "Delivery condition is required"),
  delivery_cost: z.string().min(1, "Delivery cost is required"),
});

export const FarmProductFormSchema = z.object({
  // Core product details
  product: ProductSchema,
  harvest_details: HarvestDetailsSchema,
  pricing: PricingSchema,
  logistics: LogisticsSchema,
  description: z.string().optional(),
  add_images: z.array(ImageSchema).optional(),
});

export const FarmSchema = z.object({
  // Identification and Contact Info
  userId: z.string().min(1, 'User ID is required'),
  farmName: z.string().min(1, 'Farm name is required'),
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  farmLocation: z.string().min(1, 'Farm location is required'),
  
  // Farm Specifics
  farmType: z.string().min(1, 'Farm type is required'),
  cropFarmingType: z.string().optional(),
  livestockType: z.string().optional(),
  
  // Optional Status Flags
  pinned: z.boolean().optional(),
  favorite: z.boolean().optional(),
  wishlist: z.boolean().optional(),
  
  // Core Farm Product Details
  product: ProductSchema,
  description: z.string().min(1, 'Description is required'),
  add_images: z.array(ImageSchema).optional(),
  
  // Detailed Schemas
  harvest_details: HarvestDetailsSchema,
  pricing: PricingSchema,
  logistics: LogisticsSchema,
  tags: z.array(z.string()).optional(),
});

// Type Inference for Form and API Interactions
export type FarmProductFormData = z.infer<typeof FarmProductFormSchema>;
export type FarmData = z.infer<typeof FarmSchema>;
export type ImageData = z.infer<typeof ImageSchema>;