import React, { useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Wheat,
  Fish,
  Carrot,
  Beef,
  Drumstick,
  Tractor,
  X,
  Plus,
} from "lucide-react";
import { FarmProfileData, FarmType } from "@/store/type/formtypes";
import { FaMix } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface FarmTypeSectionProps {
  formData: Partial<FarmProfileData>;
  updateFormSection: (data: Partial<FarmProfileData>) => void;
  onValidate?: (isValid: boolean) => void;
}

const farmTypeIcons = {
  [FarmType.CropFarming]: Wheat,
  [FarmType.LivestockFarming]: Beef,
  [FarmType.Mixed]: FaMix,
  [FarmType.Aquaculture]: Fish,
  [FarmType.Nursery]: Carrot,
  [FarmType.Poultry]: Drumstick,
  [FarmType.Others]: Tractor,
};

const FarmTypeSection: React.FC<FarmTypeSectionProps> = ({
  formData,
  updateFormSection,
  onValidate,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validation logic
  React.useEffect(() => {
    let isValid = true;
    let error: string | null = null;

    if (!formData.farmType) {
      isValid = false;
      error = "Please select a farm type";
    }

    // Additional specific validations based on farm type
    switch (formData.farmType) {
      case FarmType.CropFarming:
        if (!formData.cropsGrown || formData.cropsGrown.length === 0) {
          isValid = false;
          error = "Please specify at least one crop";
        }
        break;
      case FarmType.LivestockFarming:
        if (
          !formData.livestockProduced ||
          formData.livestockProduced.length === 0
        ) {
          isValid = false;
          error = "Please specify at least one livestock type";
        }
        break;
      case FarmType.Mixed:
        if (
          !formData.mixedCropsGrown ||
          formData.mixedCropsGrown.length === 0
        ) {
          isValid = false;
          error = "Please specify at least one mixed crop";
        }
        break;
      case FarmType.Aquaculture:
        if (
          !formData.aquacultureType ||
          formData.aquacultureType.length === 0
        ) {
          isValid = false;
          error = "Please specify aquaculture type";
        }
        break;
      case FarmType.Nursery:
        if (!formData.nurseryType || formData.nurseryType.length === 0) {
          isValid = false;
          error = "Please specify nursery type";
        }
        break;
      case FarmType.Poultry:
        if (!formData.poultryType || formData.poultryType.length === 0) {
          isValid = false;
          error = "Please specify poultry type";
        }
        break;
      case FarmType.Others:
        if (!formData.othersType || formData.othersType.length === 0) {
          isValid = false;
          error = "Please specify other farm type";
        }
        break;
    }

    setValidationError(error);
    onValidate?.(isValid);
  }, [formData, onValidate]);

  const handleFarmTypeChange = (value: string) => {
    updateFormSection({
      farmType: value as (typeof FarmType)[keyof typeof FarmType],
      cropsGrown: undefined,
      livestockProduced: undefined,
      mixedCropsGrown: undefined,
      aquacultureType: undefined,
      nurseryType: undefined,
      poultryType: undefined,
      othersType: undefined,
    });
  };

  // Generic function to add a new input field
  const handleAddField = (fieldType: keyof FarmProfileData) => {
    const currentFields = formData[fieldType] || [];
    if (Array.isArray(currentFields)) {
      updateFormSection({
        [fieldType]: [...currentFields, ""],
      });
    } else {
      console.error(`Field ${fieldType} is not an array`);
    }
  };

  // Generic function to remove an input field
  const handleRemoveField = (
    fieldType: keyof FarmProfileData,
    indexToRemove: number
  ) => {
    const currentFields = formData[fieldType] || [];
    if (Array.isArray(currentFields)) {
      const updatedFields = currentFields.filter(
        (_: any, index: number) => index !== indexToRemove
      );
      updateFormSection({
        [fieldType]: updatedFields,
      });
    } else {
      console.error(`Field ${fieldType} is not an array`);
    }
  };

  // Generic function to update a specific input field
  const handleFieldChange = (
    fieldType: keyof FarmProfileData,
    index: number,
    value: string
  ) => {
    const currentFields = formData[fieldType] || [];
    if (Array.isArray(currentFields)) {
      const updatedFields = [...currentFields];
      updatedFields[index] = value;
      updateFormSection({
        [fieldType]: updatedFields,
      });
    } else {
      console.error(`Field ${fieldType} is not an array`);
    }
  };

  const renderDynamicInputFields = (
    fieldType: keyof FarmProfileData,
    placeholder: string
  ) => {
    const fields = Array.isArray(formData[fieldType])
      ? (formData[fieldType] as string[])
      : [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{placeholder}</Label>
          <Button
            type="button"
            size={"icon"}
            onClick={() => handleAddField(fieldType)}
            className="flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-1" />
          </Button>
        </div>
        {fields.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            No {placeholder.toLowerCase()} added
          </div>
        )}
        {fields.map((field: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder={placeholder}
              className="flex-grow"
              value={field}
              onChange={(e) =>
                handleFieldChange(fieldType, index, e.target.value)
              }
            />
            <Button
              type="button"
              size={"icon"}
              onClick={() => handleRemoveField(fieldType, index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  const renderFarmTypeSpecificFields = () => {
    switch (formData.farmType) {
      case FarmType.CropFarming:
        return renderDynamicInputFields("cropsGrown", "Crops Grown");
      case FarmType.LivestockFarming:
        return renderDynamicInputFields(
          "livestockProduced",
          "Livestock Produced"
        );
      case FarmType.Mixed:
        return renderDynamicInputFields("mixedCropsGrown", "Mixed Crops");
      case FarmType.Aquaculture:
        return renderDynamicInputFields("aquacultureType", "Aquaculture Type");
      case FarmType.Nursery:
        return renderDynamicInputFields("nurseryType", "Nursery Type");
      case FarmType.Poultry:
        return renderDynamicInputFields("poultryType", "Poultry Type");
      case FarmType.Others:
        return renderDynamicInputFields("othersType", "Other Farm Type");
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Select Farm Type</Label>
        <Select value={formData.farmType} onValueChange={handleFarmTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Farm Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(FarmType).map((type) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center space-x-2">
                  {React.createElement(farmTypeIcons[type], {
                    className: "h-5 w-5 mr-2",
                  })}
                  <span>{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {validationError && (
        <div className="text-red-500 text-sm">{validationError}</div>
      )}

      {formData.farmType && renderFarmTypeSpecificFields()}
    </div>
  );
};

export default FarmTypeSection;
