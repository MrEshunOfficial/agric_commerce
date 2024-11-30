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
import {
  CropFarmingType,
  FarmProfileData,
  FarmType,
  Gender,
  OwnershipStatus,
  ProductionScale,
} from "@/store/type/formtypes";
import FarmInformationSection from "./farm.forms.components/FarmInformationSection";
import FarmerOwnerInformationSection from "./farm.forms.components/FarmerOwnerInformationSection";
import FarmTypeSection from "./farm.forms.components/FarmTypeSection";
import CooperativeInformationSection from "./farm.forms.components/CooperativeInformationSection";
import { Toaster } from "@/components/ui/toaster";

export default function FarmProfileForm() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const dispatch = useDispatch<AppDispatch>();
  const { currentProfile, loading, error } = useSelector(
    (state: RootState) => state.farmProfiles
  );

  const [currentSection, setCurrentSection] = useState(1);
  const [validationErrors, setValidationErrors] = useState<
    { path: string; message: string }[]
  >([]);
  const [isFormComplete, setIsFormComplete] = useState(false);

  // Initial form state with type safety
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
    cropFarmingType: CropFarmingType.Mixed,
    primaryCropsOrLivestock: [],
    belongsToCooperative: false,
  });

  const totalSections = 5;

  // Effect to handle current profile changes
  useEffect(() => {
    if (currentProfile) {
      // Safely update form data from current profile
      setFormData(currentProfile);
    }
  }, [currentProfile]);

  // Effect to handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  // Update specific section of form data
  const updateFormSection = (sectionData: Partial<FarmProfileData>) => {
    const updatedFormData = {
      ...formData,
      ...sectionData,
    };
    setFormData(updatedFormData);

    // Check if all required fields are filled
    checkFormCompleteness(updatedFormData);
  };

  // Check form completeness
  const checkFormCompleteness = (data: Partial<FarmProfileData>) => {
    const requiredFields: (keyof FarmProfileData)[] = [
      "farmName",
      "farmLocation",
      "farmSize",
      "productionScale",
      "ownershipStatus",
      "fullName",
      "contactPhone",
      "gender",
      "farmType",
      "cropFarmingType",
      "primaryCropsOrLivestock",
      "belongsToCooperative",
    ];

    const isComplete = requiredFields.every((field) => {
      const value = data[field];

      // Check for non-empty strings, non-zero numbers, and non-empty arrays
      if (typeof value === "string") return value.trim() !== "";
      if (typeof value === "number") return value !== 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null;
    });

    setIsFormComplete(isComplete);
  };

  // Page navigation handler
  const handlePageChange = (sectionId: number) => {
    setCurrentSection(sectionId);
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

    if (!isFormComplete) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add userId to form data
      const profileData: FarmProfileData = {
        userId,
        ...formData,
      } as FarmProfileData;

      if (currentProfile && currentProfile._id) {
        await dispatch(
          updateFarmProfile({
            id: currentProfile._id,
            profileData,
          })
        ).unwrap();

        toast({
          title: "Success",
          description: "Farm profile updated successfully",
        });
      } else {
        // Create new profile
        await dispatch(createFarmProfile(profileData)).unwrap();

        toast({
          title: "Success",
          description: "Farm profile created successfully",
        });
      }

      // Reset validation errors
      setValidationErrors([]);
      setIsFormComplete(false);
    } catch (err: any) {
      // Handle validation errors
      if (Array.isArray(err)) {
        setValidationErrors(err);
      }

      toast({
        title: "Submission Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
    }
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
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <FarmerOwnerInformationSection
              formData={formData}
              updateFormSection={updateFormSection}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <FarmTypeSection
              formData={formData}
              updateFormSection={updateFormSection}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <CooperativeInformationSection
              formData={formData}
              updateFormSection={updateFormSection}
            />
          </div>
        );
      case 5:
        return renderSubmissionSection();
      default:
        return null;
    }
  }

  // Submission review section
  const renderSubmissionSection = () => (
    <Card className="w-full max-w-xl mx-auto">
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

        {!isFormComplete && (
          <div className="text-yellow-700 text-sm">
            Please ensure all required fields are filled
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={loading || !isFormComplete}
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
    <div className="w-full h-auto rounded-md p-6">
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
}

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
