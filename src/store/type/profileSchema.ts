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
  role: z.enum(['Farmer', 'Buyer']),
  identityCardType: z.string().optional(),
  identityCardNumber: z.string().optional(),
})
// Export type for TypeScript usage
export type UserProfileInput = z.infer<typeof profileSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;

// Helper function to validate a profile
export const validateProfile = (data: unknown) => {
  return profileSchema.parse(data);
};

export const defaultValues: ProfileFormValues = {
  userId: "",
  email: "",
  fullName: "",
  username: "",
  profilePicture: "",
  bio: "",
  gender: "Prefer not to say",
  phoneNumber: "",
  country: "",
  socialMediaLinks: {
    twitter: null,
    facebook: null,
    instagram: null,
    linkedIn: null,
  },
  identityCardType: "",
  identityCardNumber: "",
  role: "Buyer",
};