import React, { useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wheat, Fish, Carrot, Beef, Drumstick, Tractor } from "lucide-react";
import {
  FarmType,
  CropFarmingType,
  LivestockType,
  FarmProfileData,
} from "@/store/type/formtypes";
import { GiGoat, GiPig, GiSheep } from "react-icons/gi";
import { FaCloudMeatball, FaMix } from "react-icons/fa";

// Extract string literal types from constants
export type FarmTypeType = keyof typeof FarmType;
export type CropFarmingTypeType = keyof typeof CropFarmingType;
export type LivestockTypeType = keyof typeof LivestockType;

interface FarmTypeSectionProps {
  formData: Partial<FarmProfileData>;
  updateFormSection: (data: Partial<FarmProfileData>) => void;
}

const CROP_ICONS: Record<string, React.ElementType> = {
  Maize: Carrot,
  Beans: Wheat,
  Wheat: Wheat,
  Rice: Wheat,
  Tomatoes: Carrot,
  Potatoes: Carrot,
};

const LIVESTOCK_ICONS: Record<string, React.ElementType> = {
  Cattle: Beef,
  Goats: GiGoat,
  Sheep: GiSheep,
  Chickens: Drumstick,
  Pigs: GiPig,
};

const FARM_TYPE_ICONS: Record<FarmTypeType, React.ElementType> = {
  CropFarming: Wheat,
  LivestockFarming: FaCloudMeatball,
  Mixed: FaMix,
  Aquaculture: Fish,
};

const CROP_LIST: string[] = [
  "Maize",
  "Beans",
  "Wheat",
  "Rice",
  "Tomatoes",
  "Potatoes",
];
const LIVESTOCK_LIST: string[] = [
  "Cattle",
  "Goats",
  "Sheep",
  "Chickens",
  "Pigs",
];

const FarmTypeSection: React.FC<FarmTypeSectionProps> = ({
  formData,
  updateFormSection,
}) => {
  const [cropsFarmingList, setCropsFarmingList] = useState<string[]>(
    formData.primaryCropsOrLivestock || []
  );

  const handleSelectChange = useCallback(
    (
      field: keyof Pick<
        FarmProfileData,
        "farmType" | "cropFarmingType" | "livestockType"
      >,
      value: string
    ) => {
      const updateData: Partial<FarmProfileData> = { [field]: value };

      if (field === "farmType") {
        if (value === "CropFarming") {
          updateData.livestockType = undefined;
        } else if (value === "LivestockFarming") {
          updateData.cropFarmingType = undefined;
        }
      }

      updateFormSection(updateData);
    },
    [updateFormSection]
  );

  const handleCropOrLivestockChange = useCallback(
    (crop: string) => {
      const newList = cropsFarmingList.includes(crop)
        ? cropsFarmingList.filter((item) => item !== crop)
        : [...cropsFarmingList, crop];

      setCropsFarmingList(newList);
      updateFormSection({ primaryCropsOrLivestock: newList });
    },
    [cropsFarmingList, updateFormSection]
  );

  const renderFarmTypeSpecificFields = () => {
    switch (formData.farmType) {
      case "CropFarming":
        return (
          <div className="mt-4 space-y-2">
            <Label className="flex items-center gap-2">
              <Wheat size={18} className="text-green-600" />
              Crop Farming Type
            </Label>
            <Select
              value={formData.cropFarmingType || ""}
              onValueChange={(value: CropFarmingTypeType) =>
                handleSelectChange("cropFarmingType", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select crop farming type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CropFarmingType) as CropFarmingTypeType[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      {CropFarmingType[key]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        );

      case "LivestockFarming":
        return (
          <div className="mt-4 space-y-2">
            <Label className="flex items-center gap-2">
              <Beef size={18} className="text-brown-600" />
              Livestock Type
            </Label>
            <Select
              value={formData.livestockType || ""}
              onValueChange={(value: LivestockTypeType) =>
                handleSelectChange("livestockType", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select livestock type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LivestockType) as LivestockTypeType[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      {LivestockType[key]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        );

      case "Mixed":
      case "Aquaculture":
      default:
        return null;
    }
  };

  const availableItems = React.useMemo(() => {
    switch (formData.farmType) {
      case "CropFarming":
        return CROP_LIST;
      case "LivestockFarming":
        return LIVESTOCK_LIST;
      case "Mixed":
      case "Aquaculture":
      default:
        return [...CROP_LIST, ...LIVESTOCK_LIST];
    }
  }, [formData.farmType]);

  return (
    <div className="shadow-md rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Tractor size={18} className="text-primary" strokeWidth={2.5} />
          Farm Type
        </Label>
        <Select
          value={formData.farmType || "CropFarming"}
          onValueChange={(value: FarmTypeType) =>
            handleSelectChange("farmType", value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue
              className="flex items-center"
              placeholder="Select farm type"
            >
              {formData.farmType && (
                <div className="flex items-center gap-2">
                  {React.createElement(FARM_TYPE_ICONS[formData.farmType], {
                    size: 18,
                    className: "mr-2",
                  })}
                  {FarmType[formData.farmType]}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(FarmType) as FarmTypeType[]).map((key) => (
              <SelectItem key={key} value={key} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  {React.createElement(FARM_TYPE_ICONS[key], {
                    size: 18,
                    className: "mr-2",
                  })}
                  {FarmType[key]}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {renderFarmTypeSpecificFields()}

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Carrot size={18} className="text-orange-600" />
          Primary Crops or Livestock
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableItems.map((item) => {
            const ItemIcon =
              (formData.farmType === "CropFarming"
                ? CROP_ICONS
                : LIVESTOCK_ICONS)[item] || Carrot;

            return (
              <div
                key={item}
                className="flex items-center space-x-2  p-2 rounded-md transition-colors"
              >
                <Checkbox
                  id={item}
                  checked={cropsFarmingList.includes(item)}
                  onCheckedChange={() => handleCropOrLivestockChange(item)}
                  className="border-gray-300"
                />
                <Label
                  htmlFor={item}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ItemIcon size={18} className="text-primary opacity-70" />
                  {item}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FarmTypeSection;
