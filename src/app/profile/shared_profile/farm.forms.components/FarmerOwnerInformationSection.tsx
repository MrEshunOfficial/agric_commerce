import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Gender,
  OwnershipStatus,
  GenderType,
  OwnershipStatusType,
  FarmProfileData,
} from "@/store/type/formtypes";

interface FarmerOwnerInformationSectionProps {
  formData: Partial<FarmProfileData>;
  updateFormSection: (data: Partial<FarmProfileData>) => void;
}

const FarmerOwnerInformationSection: React.FC<
  FarmerOwnerInformationSectionProps
> = ({ formData, updateFormSection }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormSection({ [name]: value });
  };

  const handleSelectChange = (field: keyof FarmProfileData, value: string) => {
    updateFormSection({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            value={formData.contactPhone || ""}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail || ""}
            onChange={handleInputChange}
            placeholder="Enter email address"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender || "Male"}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(Gender).map((key) => (
                <SelectItem key={key} value={Gender[key as GenderType]}>
                  {Gender[key as GenderType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="ownershipStatus">Ownership Status</Label>
        <Select
          value={formData.ownershipStatus || "Owned"}
          onValueChange={(value) =>
            handleSelectChange("ownershipStatus", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select ownership status" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(OwnershipStatus).map((key) => (
              <SelectItem
                key={key}
                value={OwnershipStatus[key as OwnershipStatusType]}
              >
                {OwnershipStatus[key as OwnershipStatusType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FarmerOwnerInformationSection;
