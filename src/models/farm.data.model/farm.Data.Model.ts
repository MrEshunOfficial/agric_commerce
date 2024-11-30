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
  Aquaculture: 'Aquaculture'
} as const;

const CropFarmingType = {
  Mixed: 'Mixed',
  Arable: 'Arable', 
  Horticulture: 'Horticulture',
  Perennial: 'Perennial',
  Hydroponic: 'Hydroponic'
} as const;

const LivestockType = {
  Mixed: 'Mixed',
  Dairy: 'Dairy',
  Poultry: 'Poultry',
  CattleRanching: 'Cattle Ranching',
  PigFarming: 'Pig Farming',
  Beekeeping: 'Beekeeping'
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
  // 1. Farm Information
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
  cropFarmingType?: typeof CropFarmingType[keyof typeof CropFarmingType];
  livestockType?: typeof LivestockType[keyof typeof LivestockType];
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
  cropFarmingType: {
    type: String,
    enum: Object.values(CropFarmingType)
  },
  livestockType: {
    type: String,
    enum: Object.values(LivestockType)
  },
  primaryCropsOrLivestock: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: 'At least one crop or livestock type must be specified'
    }
  },

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
}, {
  timestamps: true,
  // Add pre-save validation hooks to mimic Zod's complex validations
  validate: {
    validator: function(this: IFarmProfile) {
      // Cooperative Information Validation
      if (this.belongsToCooperative) {
        if (!this.cooperativeName) {
          return false;
        }
        if (!this.cooperativeExecutive) {
          return false;
        }
      }

      // Farm Type Specific Validations
      if (this.farmType === "Crop Farming" && !this.cropFarmingType) {
        return false;
      }

      if (this.farmType === "Livestock Farming" && !this.livestockType) {
        return false;
      }

      // Contact Information Validation
      if (!this.contactPhone && !this.contactEmail) {
        return false;
      }

      return true;
    },
    message: 'Validation failed'
  }
});

// Create the model
const FarmProfile = mongoose.models.FarmProfile || mongoose.model<IFarmProfile>('FarmProfile', FarmProfileSchema);

export default FarmProfile;