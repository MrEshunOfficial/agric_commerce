import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FarmProfileData } from "@/store/type/formtypes";

interface CooperativeInformationSectionProps {
  formData: Partial<FarmProfileData>;
  updateFormSection: (data: Partial<FarmProfileData>) => void;
}

const CooperativeInformationSection: React.FC<
  CooperativeInformationSectionProps
> = ({ formData, updateFormSection }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormSection({ [name]: value });
  };

  const handleBelongsToCooperativeChange = (checked: boolean) => {
    updateFormSection({
      belongsToCooperative: checked,
      // Reset cooperative details if unchecked
      ...(checked
        ? {}
        : {
            cooperativeName: undefined,
            cooperativeExecutive: undefined,
          }),
    });
  };

  const handleExecutiveInputChange = (field: string, value: string) => {
    updateFormSection({
      cooperativeExecutive: {
        name: formData.cooperativeExecutive?.name || "",
        position: formData.cooperativeExecutive?.position || "President",
        phone: formData.cooperativeExecutive?.phone || "",
        email: formData.cooperativeExecutive?.email || "",
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="belongsToCooperative"
          checked={formData.belongsToCooperative || false}
          onCheckedChange={handleBelongsToCooperativeChange}
        />
        <Label htmlFor="belongsToCooperative">
          Do you belong to a cooperative?
        </Label>
      </div>

      {formData.belongsToCooperative && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cooperativeName">Cooperative Name</Label>
            <Input
              id="cooperativeName"
              name="cooperativeName"
              value={formData.cooperativeName || ""}
              onChange={handleInputChange}
              placeholder="Enter cooperative name"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Cooperative Executive Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="executiveName">Executive Name</Label>
                <Input
                  id="executiveName"
                  value={formData.cooperativeExecutive?.name || ""}
                  onChange={(e) =>
                    handleExecutiveInputChange("name", e.target.value)
                  }
                  placeholder="Enter executive name"
                  required
                />
              </div>

              <div>
                <Label>Executive Position</Label>
                <Select
                  value={formData.cooperativeExecutive?.position || "President"}
                  onValueChange={(value) =>
                    handleExecutiveInputChange("position", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="President">President</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="executivePhone">Executive Phone</Label>
                <Input
                  id="executivePhone"
                  type="tel"
                  value={formData.cooperativeExecutive?.phone || ""}
                  onChange={(e) =>
                    handleExecutiveInputChange("phone", e.target.value)
                  }
                  placeholder="Enter executive phone"
                  required
                />
              </div>

              <div>
                <Label htmlFor="executiveEmail">
                  Executive Email (Optional)
                </Label>
                <Input
                  id="executiveEmail"
                  type="email"
                  value={formData.cooperativeExecutive?.email || ""}
                  onChange={(e) =>
                    handleExecutiveInputChange("email", e.target.value)
                  }
                  placeholder="Enter executive email"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CooperativeInformationSection;
