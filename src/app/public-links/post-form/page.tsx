"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AlertCircle, Loader2 } from "lucide-react";

// Store and Validation
import { fetchFarmProfiles } from "@/store/farmSlice";
import { fetchUserProfile } from "@/store/userProfileSlice";
import { postNewAd } from "@/store/postSlice";
import { RootState } from "@/store";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import types and schemas
import {
  FarmProductFormData,
  FarmProductFormSchema,
  PostData,
} from "@/store/type/post.types";

import { FarmProfileSidebar, FormNavigation } from "./PostFormNavs";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductInformation } from "./ProductInformation";
import { LogisticsComponent } from "./LogisticsComponent";

import { FarmProfileData } from "@/store/type/formtypes";
import { Button } from "@/components/ui/button";

const AdPostForm: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();
  const [selectedFarm, setSelectedFarm] = useState<FarmProfileData | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mobile view state
  const [isMobileView, setIsMobileView] = useState(false);

  // Loading states for data fetching
  const [isLoadingFarmProfiles, setIsLoadingFarmProfiles] = useState(true);
  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true);

  const handleFarmSelect = (farm: FarmProfileData) => {
    setSelectedFarm(farm);
  };

  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Form initialization with enhanced default values and type safety
  const form = useForm<FarmProductFormData>({
    resolver: zodResolver(FarmProductFormSchema),
    defaultValues: {
      product: {
        item: "",
        quantity: 0,
        price: 0,
        unit: "",
        status: true,
      },
      harvest_details: {
        harvest_ready: true,
        harvest_date: new Date(),
        quality_grade: "Standard",
      },
      pricing: {
        negotiable: false,
        bulk_discount: "",
      },
      logistics: {
        delivery_available: false,
        delivery_condition: "",
        delivery_cost: "",
      },
      description: "",
      add_images: [],
    },
  });

  // Responsive handling
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    // Check initial view
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobileView);

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingFarmProfiles(true);
        setIsLoadingUserProfile(true);

        await Promise.all([
          dispatch(fetchFarmProfiles({})),
          dispatch(fetchUserProfile({})),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoadingFarmProfiles(false);
        setIsLoadingUserProfile(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Memoized selectors for performance
  const farmProfiles = useSelector((state: RootState) => {
    const userFarmProfiles = state.farmProfiles.farmProfiles.filter(
      (f) => f.userId === userId
    );
    return userFarmProfiles as FarmProfileData[];
  });

  const userProfiles = useSelector(
    (state: RootState) => state.userProfile.profiles
  );

  const userProfile = useMemo(
    () => userProfiles.find((profile) => profile.userId === userId),
    [userProfiles, userId]
  );

  const onSubmit = async (data: FarmProductFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const validationResult = FarmProductFormSchema.safeParse(data);
      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors
          .map((err) => `${err.path.join(".")} - ${err.message}`)
          .join(", ");

        setSubmitError(`Validation Failed: ${errorMessages}`);
        setIsSubmitting(false);
        return;
      }

      if (!selectedFarm) {
        setSubmitError("Please select a farm before submitting.");
        setIsSubmitting(false);
        return;
      }

      const submissionData: PostData = {
        _id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId || "",
        farmName: selectedFarm?.farmName || "",
        fullName: userProfile?.fullName || "",
        phoneNumber: userProfile?.phoneNumber || "",
        email: userProfile?.email || "",
        farmLocation: selectedFarm?.farmLocation || "",
        farmType: selectedFarm?.farmType || "",
        cropFarmingType: selectedFarm?.cropsGrown?.join(", ") || "",
        livestockType: selectedFarm?.livestockProduced?.join(", ") || "",
        description: data.description || "No description provided",
        product: data.product,
        harvest_details: data.harvest_details,
        pricing: data.pricing,
        logistics: data.logistics,
        add_images: data.add_images || [],
        posted_at: new Date(),
        pinned: false,
        favorite: false,
        wishlist: false,
        tags: [],
      };
      await dispatch(postNewAd(submissionData)).unwrap();
      form.reset();
      setSubmitSuccess(true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while posting the ad";

      console.error("Full Error Object:", error);
      setSubmitError(errorMessage);
    } finally {
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }
  };

  const canSubmit =
    !isSubmitting &&
    !isLoadingFarmProfiles &&
    !isLoadingUserProfile &&
    !!selectedFarm;

  return (
    <main className="w-full max-h-[80vh] flex flex-col md:flex-row items-start gap-2 p-2 md:p-4">
      {/* Mobile View: Vertical Stacked Layout */}
      {isMobileView ? (
        <div className="w-full flex flex-col space-y-4">
          {/* Farm Profile Selection */}
          <div className="w-full">
            <FormNavigation
              userProfile={userProfile}
              farmProfiles={farmProfiles}
              handleFarmSelect={handleFarmSelect}
              // isMobile={true}
            />
          </div>

          {/* Form Section */}
          <section className="w-full p-2 border border-gray-300 dark:border-gray-800 rounded-md">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                {submitError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
                {submitSuccess && (
                  <Alert
                    variant="default"
                    className="mb-4 bg-green-100 dark:bg-green-900"
                  >
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Ad Posted Successfully!</AlertDescription>
                  </Alert>
                )}

                <div className="w-full flex flex-col items-center gap-2">
                  <ProductInformation form={form} />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Post Ad"
                  )}
                </Button>
              </form>
            </Form>
          </section>

          {/* Farm Profile Sidebar for Mobile */}
          <FarmProfileSidebar selectedFarm={selectedFarm} session={session} />
        </div>
      ) : (
        // Desktop View: Horizontal Layout
        <>
          <div className="w-80 h-full">
            <FormNavigation
              userProfile={userProfile}
              farmProfiles={farmProfiles}
              handleFarmSelect={handleFarmSelect}
            />
          </div>
          <section className="flex-1 h-full p-2 border border-gray-300 dark:border-gray-800 rounded-md">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full p-2"
              >
                {submitError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
                {submitSuccess && (
                  <Alert
                    variant="default"
                    className="mb-4 bg-green-100 dark:bg-green-900"
                  >
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Ad Posted Successfully!</AlertDescription>
                  </Alert>
                )}

                <div className="w-full flex flex-col items-center gap-2">
                  <ProductInformation form={form} />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Post Ad"
                  )}
                </Button>
              </form>
            </Form>
          </section>
          <div className="w-80 h-full">
            <FarmProfileSidebar selectedFarm={selectedFarm} session={session} />
          </div>
        </>
      )}
    </main>
  );
};

export default AdPostForm;
