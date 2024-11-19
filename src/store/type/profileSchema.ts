import { z } from 'zod';

// Social Media Links Schema
const socialMediaLinksSchema = z.object({
  twitter: z.string().url("Invalid Twitter URL").nullable().optional(),
  facebook: z.string().url("Invalid Facebook URL").nullable().optional(),
  instagram: z.string().url("Invalid Instagram URL").nullable().optional(),
  linkedIn: z.string().url("Invalid LinkedIn URL").nullable().optional()
}).optional();

// Main Profile Schema
export const profileSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  userId: z.string(),
  fullName: z.string().min(1, "Full name is required").max(50),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  profilePicture: z.string().optional(),
  bio: z.string().max(500).optional(),
  gender: z.enum(['Male', 'Female', 'Non-binary', 'Prefer not to say']),
  phoneNumber: z.string().min(10).max(15),
  country: z.string().min(1, "Country is required"),
  socialMediaLinks: socialMediaLinksSchema,
  role: z.enum(['Farmer', 'Buyer', 'Both']),
  identityCardType: z.string().optional(),
  identityCardNumber: z.string().optional(),
  
  isFarmer: z.boolean(),
  isBuyer: z.boolean(),
  farmDetails: z.object({
    farmName: z.string().optional(),
    location: z.string().optional(),
    sizeInAcres: z.number().optional(),
    cropsGrown: z.array(z.string()).optional(),
    livestock: z.array(z.string()).optional(),
  }).optional(),
}).refine((data) => {
  // If user is a farmer, validate farm details
  if (data.isFarmer) {
    return (
      data.farmDetails?.farmName &&
      data.farmDetails?.location &&
      data.farmDetails?.sizeInAcres !== undefined
    );
  }
  return true;
}, {
  message: "Farm details are required when registering as a farmer",
  path: ["farmDetails"],
});
// Export type for TypeScript usage
export type UserProfileInput = z.infer<typeof profileSchema>;

// Helper function to validate a profile
export const validateProfile = (data: unknown) => {
  return profileSchema.parse(data);
};
