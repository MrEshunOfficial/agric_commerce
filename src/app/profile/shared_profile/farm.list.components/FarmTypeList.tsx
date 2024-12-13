import React from "react";
import {
  Wheat,
  Sprout,
  Fish,
  Layers,
  Beef,
  Trees,
  Flower,
  CircleDashed,
  LucideBeef,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FarmProfileData, FarmType } from "@/store/type/formtypes";

const FarmTypeDetails: React.FC<{ profile: FarmProfileData }> = ({
  profile,
}) => {
  // Function to get icon based on farm type
  const getFarmTypeIcon = () => {
    switch (profile.farmType) {
      case "Crop Farming":
        return <Wheat className="mr-3 text-primary" size={24} />;
      case "Livestock Farming":
        return <Beef className="mr-3 text-primary" size={24} />;
      case "Mixed":
        return <Layers className="mr-3 text-primary" size={24} />;
      case "Aquaculture":
        return <Fish className="mr-3 text-primary" size={24} />;
      case "Nursery":
        return <Trees className="mr-3 text-primary" size={24} />;
      case "Poultry":
        return <LucideBeef className="mr-3 text-primary" size={24} />;
      case "Others":
        return <CircleDashed className="mr-3 text-primary" size={24} />;
      default:
        return null;
    }
  };

  // Function to get badge color based on farm type
  const getFarmTypeBadgeVariant = () => {
    switch (profile.farmType) {
      case "Crop Farming":
        return "green";
      case "Livestock Farming":
        return "amber";
      case "Mixed":
        return "blue";
      case "Aquaculture":
        return "teal";
      case "Nursery":
        return "emerald";
      case "Poultry":
        return "orange";
      case "Others":
        return "gray";
      default:
        return "default";
    }
  };

  // Function to get specific type details based on farm type
  const getSpecificTypeDetails = () => {
    switch (profile.farmType) {
      case "Crop Farming":
        return profile.cropsGrown?.length ? (
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
            <Wheat className="mr-4 text-primary/80" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Crops Grown
              </p>
              <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-5 space-y-1">
                {profile.cropsGrown?.map((crop, index) => (
                  <li key={index} className="pl-2">
                    {crop}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;

      case "Livestock Farming":
        return profile.livestockProduced?.length ? (
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
            <Beef className="mr-4 text-primary/80" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Livestock Produced
              </p>
              <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-5 space-y-1">
                {profile.livestockProduced?.map((livestock, index) => (
                  <li key={index} className="pl-2">
                    {livestock}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;

      case "Mixed":
        return profile.mixedCropsGrown?.length ? (
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
            <Layers className="mr-4 text-primary/80" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Mixed Crops
              </p>
              <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-5 space-y-1">
                {profile.mixedCropsGrown?.map((crop, index) => (
                  <li key={index} className="pl-2">
                    {crop}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;

      case "Aquaculture":
        return profile.aquacultureType?.length ? (
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
            <Fish className="mr-4 text-primary/80" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Aquaculture Type
              </p>
              <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-5 space-y-1">
                {profile.aquacultureType?.map((type, index) => (
                  <li key={index} className="pl-2">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;

      case "Nursery":
        return profile.nurseryType?.length ? (
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
            <Trees className="mr-4 text-primary/80" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Nursery Type
              </p>
              <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-5 space-y-1">
                {profile.nurseryType?.map((type, index) => (
                  <li key={index} className="pl-2">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;

      case "Poultry":
        return profile.poultryType?.length ? (
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
            <LucideBeef className="mr-4 text-primary/80" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Poultry Type
              </p>
              <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-5 space-y-1">
                {profile.poultryType?.map((type, index) => (
                  <li key={index} className="pl-2">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;

      case "Others":
        return profile.othersType?.length ? (
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
            <CircleDashed className="mr-4 text-primary/80" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Other Farm Types
              </p>
              <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-5 space-y-1">
                {profile.othersType?.map((type, index) => (
                  <li key={index} className="pl-2">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-gray-100">
            {getFarmTypeIcon()}
            Farm Type Details
          </CardTitle>
          <Badge variant={getFarmTypeBadgeVariant() as any}>
            {profile.farmType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Primary Farm Type Information */}
          <div className="space-y-6">
            <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
              <Sprout className="mr-4 text-primary/80" size={24} />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Farm Type
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {profile.farmType}
                </p>
              </div>
            </div>

            {/* Specific Type Details Section */}
            {getSpecificTypeDetails()}
          </div>

          {/* Primary Crops or Livestock */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
              <div className="flex items-start mb-3">
                <Layers className="mr-4 text-primary/80 mt-1" size={24} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Primary Crops/Livestock
                  </p>
                  <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-5 space-y-1">
                    {profile.primaryCrop && <li>{profile.primaryCrop}</li>}
                    {profile.primaryLivestock && (
                      <li>{profile.primaryLivestock}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmTypeDetails;
