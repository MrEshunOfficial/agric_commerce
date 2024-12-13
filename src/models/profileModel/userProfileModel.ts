import mongoose, { Document, Schema, Model } from 'mongoose';

// add rating document

interface RatingsDocument extends Document {
  farmer_rating: number;
  review: string;
  createdAt: Date;
}
// Interface for the UserProfile document
export interface IUserProfile extends Document {
  _id: string;
  userId: string;
  email: string;
  fullName: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  phoneNumber: string;
  country: string;
  socialMediaLinks?: {
    twitter?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    linkedIn?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  verified?: boolean;
  ratings?: RatingsDocument;

  // Identity card details
  identityCardType?: string;
  identityCardNumber?: string;
  role: 'Farmer' | 'Buyer';
}

const RatingsSchema = new Schema<RatingsDocument>({
  farmer_rating: { 
    type: Number, 
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: String
});

const ProfileSchema = new Schema<IUserProfile>(
  {
    userId: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    fullName:  {
      type: String, 
      required: true,
      trim: true,
      maxlength: 50 
    },
    username: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    profilePicture: { 
      type: String,
      trim: true 
    },
    bio: { 
      type: String,
      maxlength: 500,
      trim: true 
    },
    gender: { 
      type: String, 
      enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
      required: true 
    },
    phoneNumber: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 15
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    socialMediaLinks: {
      twitter: { type: String, trim: true, default: null },
      facebook: { type: String, trim: true, default: null },
      instagram: { type: String, trim: true, default: null },
      linkedIn: { type: String, trim: true, default: null }
    },
    identityCardType: {
      type: String,
      trim: true
    },
    identityCardNumber: {
      type: String,
      trim: true
    },
   
    role: {
      type: String,
      enum: ['Farmer', 'Buyer'],
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    ratings:[ {
      type: RatingsSchema,
      required: false
    }],
   
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes
ProfileSchema.index({ email: 1 });
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ username: 1 });

// Add URL validation middleware
ProfileSchema.pre('save', function(next) {
  const profile = this;
  if (profile.socialMediaLinks) {
    const links = profile.socialMediaLinks;
    Object.keys(links).forEach(key => {
      if (links[key as keyof typeof links] === '') {
        links[key as keyof typeof links] = null;
      }
    });
  }
  next();
});

// Model creation with error handling
let UserProfile: Model<IUserProfile>;
try {
  UserProfile = mongoose.model<IUserProfile>('UserProfile');
} catch {
  UserProfile = mongoose.model<IUserProfile>('UserProfile', ProfileSchema);
}

export { UserProfile };