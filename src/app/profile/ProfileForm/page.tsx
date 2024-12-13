"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "@/store";
import { createUserProfile, updateUserProfile } from "@/store/userProfileSlice";
import { useRouter } from "next/navigation";
import {
  defaultValues,
  ProfileFormValues,
  profileSchema,
} from "@/store/type/profileSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...defaultValues,
      fullName: fullName || "",
      email: userMail || "",
    },
  });

  const { setValue, control } = form;

  useEffect(() => {
    // First, set the session data
    setValue("fullName", fullName || "");
    setValue("email", userMail || "");

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
      toast({
        title: "Profile Saved",
        description: "Your profile has been successfully saved.",
      });
      router.push("/profile/shared_profile");
    } catch (error) {
      toast({
        title: "Failed to Save Profile",
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full mt-3 border-none">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Basic Information Column */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Basic Information</h3>
              {/* Role Selection */}
              <div className="space-y-4 mb-3">
                <h3 className="text-sm font-medium">
                  Please indicate whether you are a farmer or a customer? *
                </h3>
                <div className="flex items-center space-x-4">
                  <FormField
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-4">
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex items-center space-x-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Farmer" id="farmer" />
                                <FormLabel htmlFor="farmer">Farmer</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Buyer" id="buyer" />
                                <FormLabel htmlFor="buyer">Customer</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
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
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

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

            {/* Secondary Information Column */}
            <div className="space-y-3">
              {/* Identity Card Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Identity Card Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            value={field.value ?? ""}
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
              </div>
            </div>

            {/* Submit Button - Full Width Across Grid */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Profile"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <Toaster />
    </Card>
  );
};

export default ProfileForm;
