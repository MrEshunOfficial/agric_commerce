"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Info, Loader2, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

// Import actions and types
import { createFarmProfile, updateFarmProfile } from "@/store/farmSlice";
import { Toaster } from "@/components/ui/toaster";
import FarmInformationSection from "../farm.forms.components/FarmInformationSection";
import FarmerOwnerInformationSection from "../farm.forms.components/FarmerOwnerInformationSection";
import FarmTypeSection from "../farm.forms.components/FarmTypeSection";
import CooperativeInformationSection from "../farm.forms.components/CooperativeInformationSection";
import { useRouter } from "next/navigation";
import {
  FarmProfileData,
  FarmType,
  Gender,
  OwnershipStatus,
  ProductionScale,
} from "@/store/type/formtypes";

const FarmProfileForm = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isFormActive, setIsFormActive] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { currentProfile, loading, error } = useSelector(
    (state: RootState) => state.farmProfiles
  );

  const [currentSection, setCurrentSection] = useState(1);
  const [validationErrors, setValidationErrors] = useState<
    { path: string; message: string }[]
  >([]);
  const router = useRouter();

  // Initial form state with type safety aligned with FarmProfileData
  const [formData, setFormData] = useState<Partial<FarmProfileData>>({
    farmName: "",
    farmLocation: "",
    farmSize: 0,
    productionScale: ProductionScale.Small,
    ownershipStatus: OwnershipStatus.Owned,
    fullName: "",
    contactPhone: "",
    gender: Gender.Male,
    farmType: FarmType.Mixed,
    belongsToCooperative: false,

    // Optional arrays for different farm types
    cropsGrown: [],
    livestockProduced: [],
    mixedCropsGrown: [],
  });

  const totalSections = 4;

  useEffect(() => {
    // Only populate form data if we're updating an existing profile
    if (currentProfile?._id) {
      const completeProfileData: Partial<FarmProfileData> = {
        ...currentProfile,
        // Ensure all arrays are initialized
        cropsGrown: currentProfile.cropsGrown || [],
        livestockProduced: currentProfile.livestockProduced || [],
        mixedCropsGrown: currentProfile.mixedCropsGrown || [],
        farmSize: currentProfile.farmSize || 0,
        belongsToCooperative: currentProfile.belongsToCooperative ?? false,
      };

      setFormData(completeProfileData);
    } else {
      // Reset to initial empty state when creating a new profile
      setFormData({
        farmName: "",
        farmLocation: "",
        farmSize: 0,
        productionScale: ProductionScale.Small,
        ownershipStatus: OwnershipStatus.Owned,
        fullName: "",
        contactPhone: "",
        gender: Gender.Male,
        farmType: FarmType.Mixed,
        belongsToCooperative: false,
        cropsGrown: [],
        livestockProduced: [],
        mixedCropsGrown: [],
      });
    }
  }, [currentProfile]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const updateFormSection = (sectionData: Partial<FarmProfileData>) => {
    const updatedFormData = {
      ...formData,
      ...sectionData,
    };

    // Ensure arrays are initialized
    updatedFormData.cropsGrown = updatedFormData.cropsGrown || [];
    updatedFormData.livestockProduced = updatedFormData.livestockProduced || [];
    updatedFormData.mixedCropsGrown = updatedFormData.mixedCropsGrown || [];

    setFormData(updatedFormData);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a farm profile",
        variant: "destructive",
      });
      return;
    }

    try {
      const profileData: FarmProfileData = {
        ...formData,
        userId,
      } as FarmProfileData;

      let response;
      if (currentProfile?._id) {
        response = await dispatch(
          updateFarmProfile({
            id: currentProfile._id,
            profileData,
          })
        ).unwrap();

        toast({
          title: "Success",
          description: "Farm profile updated successfully",
        });
        setIsFormActive(false);
        window.location.reload();
      } else {
        // Creating new profile
        response = await dispatch(createFarmProfile(profileData)).unwrap();
        toast({
          title: "Success",
          description: "Farm profile created successfully",
        });
        router.push(`/profile/shared_profile`);
      }

      // Reset validation errors
      setValidationErrors([]);
    } catch (error) {
      console.error("Submission Error:", error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        title: "Submission Error",
        description: errorMessage || "Please check the form for errors",
        variant: "destructive",
      });

      if (Array.isArray(error)) {
        setValidationErrors(error);
      }
    }
  };

  // Page navigation handler
  const handlePageChange = (sectionId: number) => {
    setCurrentSection(sectionId);
  };

  const renderPaginationLinks = () => {
    const links = [];
    for (let i = 1; i <= totalSections; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={currentSection === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return links;
  };

  // Render current section
  function renderSection() {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-4">
            <FarmInformationSection
              formData={formData}
              updateFormSection={updateFormSection}
            />

            <FarmerOwnerInformationSection
              formData={formData}
              updateFormSection={updateFormSection}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FarmTypeSection
              formData={formData}
              updateFormSection={updateFormSection}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <CooperativeInformationSection
              formData={formData}
              updateFormSection={updateFormSection}
            />
          </div>
        );
      case 4:
        return renderSubmissionSection();
      default:
        return null;
    }
  }

  // Submission review section
  const renderSubmissionSection = () => (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start space-x-4 p-4 rounded-lg">
          <Info className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Submission Review
            </h3>
            <p className="text-blue-800 text-sm">
              Review your farm profile details before submission.
            </p>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className=" p-4 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-2">
              Validation Errors
            </h4>
            {validationErrors.map((err, index) => (
              <p key={index} className="text-red-700 text-sm">
                {err.path}: {err.message}
              </p>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 text-green-700">
          <Check className="text-green-600" size={20} />
          <span className="text-sm">
            Profile data collected in {totalSections - 1} sections
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center"
          variant="outline"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Send size={20} className="mr-2" />
              Submit Farm
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="w-full h-full bg-gray-300/50 rounded-md p-2">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">
            {getSectionTitle(currentSection)}
          </h2>
          {renderSection()}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  handlePageChange(Math.max(1, currentSection - 1))
                }
                className={
                  currentSection === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {renderPaginationLinks()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(Math.min(totalSections, currentSection + 1))
                }
                className={
                  currentSection === totalSections
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </form>
      <Toaster />
    </div>
  );
};

// Section title helper function
function getSectionTitle(section: number) {
  const titles = [
    "Farm Information",
    "Farmer Owner Information",
    "Farm Type",
    "Cooperative Information",
    "Submit Information",
  ];
  return titles[section - 1];
}

export default FarmProfileForm;
