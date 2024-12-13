import mongoose, { Schema, Document, Model } from 'mongoose';
import validator from 'validator';

// Harvest Details Schema and Interface
export interface HarvestDetailsDocument extends Document {
  harvest_ready: boolean;
  quantity?: number;
  unit?: string;
  harvest_date?: Date;
  quality_grade?: string;
}

const HarvestDetailsSchema = new Schema<HarvestDetailsDocument>({
  quantity: { 
    type: Number, 
    required: false, 
    min: [0, 'Quantity cannot be negative'] 
  },
  unit: { 
    type: String, 
    required: false, 
    trim: true 
  },
  harvest_date: { 
    type: String, 
    required: false,  
  },
  quality_grade: { 
    type: String,
    enum: ['A', 'B', 'C', 'Premium', 'Standard'],
    default: 'Standard',
    required: false
  }
});

// Product Schema and Interface
export interface ProductDocument extends Document {
  item: string;
  quantity: number;
  price: number;
  unit: string;
}

const ProductSchema = new Schema<ProductDocument>({
  item: { 
    type: String, 
    required: true,
    trim: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: [0, 'Quantity cannot be negative'] 
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative'] 
  },
  unit: { 
    type: String, 
    required: true,
    trim: true 
  },
 
});

// Pricing Schema and Interface
export interface PricingDocument extends Document {
  negotiable: boolean;
  bulk_discount?: string;
}

const PricingSchema = new Schema<PricingDocument>({
  negotiable: { 
    type: Boolean, 
    default: false 
  },
  bulk_discount: { 
    type: String,
    trim: true 
  },
});

// Logistics Schema and Interface
export interface LogisticsDocument extends Document {
  delivery_available: boolean;
  delivery_condition: string;
  delivery_cost: string;
}

const LogisticsSchema = new Schema<LogisticsDocument>({
  delivery_available: { 
    type: Boolean, 
    default: false 
  },
  delivery_condition: { 
    type: String,
    trim: true,
    required: true 
  },
  delivery_cost: { 
    type: String,
    trim: true,
    required: true 
  }
});

// Ratings Schema and Interface
export interface RatingsDocument extends Document {
  farmer_rating?: number;
  review?: string;
}

// Main Farm Schema and Interface
export interface IAdDocument extends Document {
  _id: string;
  userId: string;
  farmName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  farmLocation: string;
  farmType: string;
  cropFarmingType?: string;
  livestockType?: string;
  pinned?: boolean;
  favorite?: boolean;
  wishlist?: boolean;
  product: ProductDocument;
  description: string;
  add_images: string[];
  harvest_details: HarvestDetailsDocument;
  pricing: PricingDocument;
  logistics: LogisticsDocument;
  posted_at: Date;
  tags?: string[];
  status?: string;
  createdAt: Date;
  updatedAt: Date
}

export const AdPostSchema = new Schema<IAdDocument>({
  userId: { 
    type: String, 
    required: true,
  },
  farmName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  farmLocation: {
    type: String,
    required: true,
  },
  farmType: {
    type: String,
    required: true,
  },
  cropFarmingType: {
    type: String,
    required: false,
  },
  livestockType: {
    type: String,
    required: false,
  },
  product: ProductSchema,
  description: { 
    type: String, 
    required: true,
    trim: true 
  },
  add_images: [{
    url: {
      type: String,
      validate: {
        validator: function(v: string) {
          // Allow both standard URLs and base64 data URIs
          return validator.isURL(v) || 
                 /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(v);
        },
        message: 'Invalid image URL or base64 image'
      }
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      minlength: 1
    }
  }],
  harvest_details: {
    type: HarvestDetailsSchema,
    required: true
  },
  pinned: { 
    type: Boolean, 
    default: false 
  },
  wishlist: {
    type: Boolean,
    default: false
  },
  favorite: {
    type: Boolean,
    default: false
  },
  pricing: {
    type: PricingSchema,
    required: true
  },
  logistics: {
    type: LogisticsSchema,
    required: true
  },
  posted_at: { 
    type: Date, 
    default: Date.now 
  },
 

  tags: [{ 
    type: String,
    trim: true 
  }],
 
}, {
  timestamps: true
});

// Create and export the Farm model
const AdPostModel = mongoose.models.AdPostModel || mongoose.model<IAdDocument>('AdPostModel', AdPostSchema);
export default AdPostModel;