import React from "react";
import { Wheat, Sprout, Fish, Layers, Beef } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FarmProfileData } from "@/store/type/formtypes";

const FarmTypeDetails: React.FC<{ profile: FarmProfileData }> = ({
  profile,
}) => {
  // Function to get icon based on farm type
  const getFarmTypeIcon = () => {
    switch (profile.farmType) {
      case "CropFarming":
        return <Wheat className="mr-3 text-primary" size={24} />;
      case "LivestockFarming":
        return <Beef className="mr-3 text-primary" size={24} />;
      case "Mixed":
        return <Layers className="mr-3 text-primary" size={24} />;
      case "Aquaculture":
        return <Fish className="mr-3 text-primary" size={24} />;
      default:
        return null;
    }
  };

  // Function to get badge color based on farm type
  const getFarmTypeBadgeVariant = () => {
    switch (profile.farmType) {
      case "CropFarming":
        return "green";
      case "LivestockFarming":
        return "amber";
      case "Mixed":
        return "blue";
      case "Aquaculture":
        return "teal";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-gray-100">
            {getFarmTypeIcon()}
            Farm Type Details
          </CardTitle>
          <Badge variant={getFarmTypeBadgeVariant() as any}>
            {profile.farmType.replace(/([A-Z])/g, " $1").trim()}
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
                  {profile.farmType.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            </div>

            {profile.cropFarmingType && (
              <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
                <Wheat className="mr-4 text-primary/80" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Crop Farming Type
                  </p>
                  <p className="text-base text-gray-900 dark:text-gray-100">
                    {profile.cropFarmingType}
                  </p>
                </div>
              </div>
            )}

            {profile.livestockType && (
              <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
                <Beef className="mr-4 text-primary/80" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Livestock Type
                  </p>
                  <p className="text-base text-gray-900 dark:text-gray-100">
                    {profile.livestockType}
                  </p>
                </div>
              </div>
            )}
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
                    {profile.primaryCropsOrLivestock.map((item, index) => (
                      <li key={index} className="pl-2">
                        {item}
                      </li>
                    ))}
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
