"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "@/store";
import { createUserProfile, updateUserProfile } from "@/store/userProfileSlice";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/store/type/profileSchema";
import { LoadingPageSkeleton } from "@/components/ui/LoadingContent";

type ProfileFormValues = z.infer<typeof profileSchema>;

const defaultValues: ProfileFormValues = {
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
  isFarmer: false,
  isBuyer: false,
  farmDetails: {
    farmName: "",
    location: "",
    sizeInAcres: 0,
    cropsGrown: [],
    livestock: [],
  },
  role: "Buyer",
};

const ProfileForm: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const fullName = session?.user?.name;
  const userMail = session?.user?.email;

  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector(
    (state: RootState) => state.userProfile
  );

  const [cropsInput, setCropsInput] = useState("");
  const [livestockInput, setLivestockInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...defaultValues,
      fullName: fullName || "",
      email: userMail || "",
    },
  });

  const { watch, setValue, control } = form;
  const isFarmer = watch("isFarmer");

  useEffect(() => {
    // First, set the session data
    setValue("fullName", fullName || "");
    setValue("email", userMail || "");

    // Then, if there's an existing profile, populate all fields
    if (profile) {
      Object.entries(profile).forEach(([key, value]) => {
        if (key !== "email" && key !== "fullName") {
          setValue(key as keyof ProfileFormValues, value);
        }
      });
    }
  }, [profile, setValue, fullName, userMail]);

  // Form submission handler
  const onSubmit = async (data: ProfileFormValues) => {
    if (!userId) return;

    try {
      setIsSubmitting(true);
      const profileData = {
        ...data,
        userId,
      };

      if (profile) {
        await dispatch(updateUserProfile(profileData)).unwrap();
      } else {
        await dispatch(createUserProfile(profileData)).unwrap();
      }
      router.push("/profile");
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for arrays
  const handleAddCrop = () => {
    if (!cropsInput.trim()) return;
    const currentCrops = form.getValues("farmDetails.cropsGrown") || [];
    setValue("farmDetails.cropsGrown", [...currentCrops, cropsInput.trim()]);
    setCropsInput("");
  };

  const handleAddLivestock = () => {
    if (!livestockInput.trim()) return;
    const currentLivestock = form.getValues("farmDetails.livestock") || [];
    setValue("farmDetails.livestock", [
      ...currentLivestock,
      livestockInput.trim(),
    ]);
    setLivestockInput("");
  };

  const removeCrop = (index: number) => {
    const currentCrops = form.getValues("farmDetails.cropsGrown") || [];
    setValue(
      "farmDetails.cropsGrown",
      currentCrops.filter((_, i) => i !== index)
    );
  };

  const removeLivestock = (index: number) => {
    const currentLivestock = form.getValues("farmDetails.livestock") || [];
    setValue(
      "farmDetails.livestock",
      currentLivestock.filter((_, i) => i !== index)
    );
  };

  if (!userId) {
    return <div>Please sign in to access your profile.</div>;
  }

  if (loading === "pending") {
    return <LoadingPageSkeleton />;
  }

  return (
    <Card className="w-full h-[77vh] overflow-scroll">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@example.com"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="fullName"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="username"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="user123" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bio"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us about yourself..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+1234567890"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="country"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="United States" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Identity Card Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Identity Card Details</h3>

              <FormField
                name="identityCardType"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Card Type</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="National ID/Passport/Driver's License"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="identityCardNumber"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Card Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Card number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Media Links</h3>

              <FormField
                name="socialMediaLinks.twitter"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://twitter.com/username"
                        value={field.value ?? ""} // Ensures value is always a string
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="socialMediaLinks.facebook"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://facebook.com/username"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="socialMediaLinks.instagram"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://instagram.com/username"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="socialMediaLinks.linkedIn"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Are you a farmer or a buyer?
              </h3>
              <div className="flex items-center space-x-4">
                <FormField
                  name="isFarmer"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Farmer</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="isBuyer"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Buyer</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Farm Details Section - Only shown if isFarmer is true */}
            {isFarmer && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Farm Details</h3>

                  <FormField
                    name="farmDetails.farmName"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farm Name {isFarmer && "*"}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Green Acres Farm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="farmDetails.location"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farm Location {isFarmer && "*"}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="123 Farm Road, Rural City"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="farmDetails.sizeInAcres"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Farm Size (acres) {isFarmer && "*"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.1"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Crops Section - Now optional */}
                  <div className="space-y-2">
                    <FormLabel>Crops Grown (optional)</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        value={cropsInput}
                        onChange={(e) => setCropsInput(e.target.value)}
                        placeholder="Add a crop"
                      />
                      <Button type="button" onClick={handleAddCrop}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("farmDetails.cropsGrown")
                        ?.map((crop, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="p-2"
                          >
                            {crop}
                            <button
                              type="button"
                              onClick={() => removeCrop(index)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  </div>

                  {/* Livestock Section - Now optional */}
                  <div className="space-y-2">
                    <FormLabel>Livestock (optional)</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        value={livestockInput}
                        onChange={(e) => setLivestockInput(e.target.value)}
                        placeholder="Add livestock"
                      />
                      <Button type="button" onClick={handleAddLivestock}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("farmDetails.livestock")
                        ?.map((animal, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="p-2"
                          >
                            {animal}
                            <button
                              type="button"
                              onClick={() => removeLivestock(index)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
