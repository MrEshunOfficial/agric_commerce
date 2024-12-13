import mongoose, { Document, Schema, Model } from 'mongoose';
import validator from 'validator';

// Enums (same as in the original file)
const OwnershipStatus = {
  Owned: 'Owned',
  Leased: 'Leased',
  Rented: 'Rented',
  Communal: 'Communal'
} as const;

const FarmType = {
  CropFarming: 'Crop Farming',
  LivestockFarming: 'Livestock Farming',
  Mixed: 'Mixed',
  Aquaculture: 'Aquaculture',
  Nursery: 'Nursery',
  Poultry: 'Poultry',
  Others: 'Others',
} as const;

const ProductionScale = {
  Small: 'Small',
  Medium: 'Medium',
  Commercial: 'Commercial'
} as const;

const Gender = {
  Male: 'Male',
  Female: 'Female',
  Other: 'Other',
  PreferNotToSay: 'Prefer Not to Say'
} as const;

// Type for Mongoose Document
export interface IFarmProfile extends Document {
  _id: string;
  userId: string;
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

  // 3. Farm Type
  farmType: typeof FarmType[keyof typeof FarmType];
  cropsGrown?: string[];
  livestockProduced?: string[];
  mixedCropsGrown?: string[];
  aquacultureType?: string[];
  nurseryType?: string[];
  poultryType?: string[];
  othersType?: string[];

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

// Mongoose Schema
const FarmProfileSchema: Schema<IFarmProfile> = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  // 1. Farm Information
  farmName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  farmLocation: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  nearbyLandmarks: [{
    type: String,
    trim: true
  }],
  gpsAddress: {
    type: String,
    trim: true
  },
  farmSize: {
    type: Number,
    required: true,
    min: 0
  },
  productionScale: {
    type: String,
    required: true,
    enum: Object.values(ProductionScale)
  },
  farmImages: [{
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

  // 2. Farmer Owner Information
  ownershipStatus: {
    type: String,
    required: true,
    enum: Object.values(OwnershipStatus)
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  contactEmail: {
    type: String,
    trim: true,
    validate: {
      validator: (v: string) => !v || validator.isEmail(v),
      message: 'Invalid email address'
    }
  },
  gender: {
    type: String,
    required: true,
    enum: Object.values(Gender)
  },

  // 3. Farm Type
  farmType: {
    type: String,
    required: true,
    enum: Object.values(FarmType)
  },
  cropsGrown: [{
    type: String,
    trim: true
  }],
  livestockProduced: [{
    type: String,
    trim: true
  }],
  mixedCropsGrown: [{
    type: String,
    trim: true
  }],
  aquacultureType: [{
    type: String,
    trim: true
  }],
  nurseryType: [{
    type: String,
    trim: true
  }],
  poultryType: [{
    type: String,
    trim: true
  }],
  othersType: [{
    type: String,
    trim: true
  }],
  // 4. Groups and Cooperative Information
  belongsToCooperative: {
    type: Boolean,
    required: true
  },
  cooperativeName: {
    type: String,
    trim: true
  },
  cooperativeExecutive: {
    name: {
      type: String,
      trim: true,
      minlength: 2
    },
    position: {
      type: String,
      enum: ['President', 'Secretary']
    },
    phone: {
      type: String,
      trim: true,
      minlength: 10
    },
    email: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || validator.isEmail(v),
        message: 'Invalid email address'
      }
    }
  },
  agriculturalOfficer: {
    name: {
      type: String,
      trim: true,
      minlength: 2
    },
    phone: {
      type: String,
      trim: true,
      minlength: 10
    },
    email: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || validator.isEmail(v),
        message: 'Invalid email address'
      }
    }
  }
}, {timestamps: true});

// Create the model
const FarmProfile = mongoose.models.FarmProfile || mongoose.model<IFarmProfile>('FarmProfile', FarmProfileSchema);

export default FarmProfile;