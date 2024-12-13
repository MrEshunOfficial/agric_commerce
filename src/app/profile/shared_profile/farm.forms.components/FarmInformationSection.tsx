import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FarmProfileData, ProductionScale } from "@/store/type/formtypes";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import {
  Home,
  MapPin,
  Landmark,
  Compass,
  Ruler,
  BarChart,
  CloudUpload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FarmInformationSectionProps {
  formData: Partial<FarmProfileData>;
  updateFormSection: (data: Partial<FarmProfileData>) => void;
}

const FarmInformationSection: React.FC<FarmInformationSectionProps> = ({
  formData,
  updateFormSection,
}) => {
  const [farmImageFiles, setFarmImageFiles] = useState<File[]>([]);
  const [isImageUploadExpanded, setIsImageUploadExpanded] = useState(false);

  const handleInputChange = (
    field: keyof FarmProfileData,
    value: string | number | string[]
  ) => {
    updateFormSection({ [field]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      const updatedFiles = [
        ...farmImageFiles,
        ...newFiles.filter(
          (newFile) =>
            !farmImageFiles.some(
              (existingFile) => existingFile.name === newFile.name
            )
        ),
      ];

      const limitedFiles = updatedFiles.slice(0, 5);
      setFarmImageFiles(limitedFiles);

      const imageUrls = limitedFiles.map((file) => {
        const reader = new FileReader();
        return new Promise<{ url: string; fileName: string }>((resolve) => {
          reader.onloadend = () => {
            resolve({
              url: reader.result as string,
              fileName: file.name,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imageUrls).then((urls) => {
        updateFormSection({
          farmImages: urls,
        });
      });
    }
  };

  const removeImage = (fileToRemove: File) => {
    const updatedFiles = farmImageFiles.filter((file) => file !== fileToRemove);
    setFarmImageFiles(updatedFiles);

    const farmImages = updatedFiles.map((file) => {
      const reader = new FileReader();
      return new Promise<{ url: string; fileName: string }>((resolve) => {
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(farmImages).then((resolvedImages) => {
      updateFormSection({
        farmImages: resolvedImages,
      });
    });
  };

  const productionScaleOptions = Object.values(ProductionScale);
  const iconClassName = "text-muted-foreground mr-2";
  const iconSize = 18;

  return (
    <Card className="w-full">
      <CardContent className="w-full p-4">
        {/* Responsive Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Form Fields - Mobile Scrollable, Desktop Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
            {/* Farm Name Input */}
            <div className="space-y-2 flex flex-col sm:flex-row items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center mb-2 sm:mb-0 sm:mr-2">
                  <Home size={iconSize} className={iconClassName} />
                  <Label htmlFor="farmName">Farm Name</Label>
                </div>
                <Input
                  id="farmName"
                  placeholder="Enter your farm name"
                  value={formData.farmName || ""}
                  onChange={(e) =>
                    handleInputChange("farmName", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Farm Location Input */}
            <div className="space-y-2 flex flex-col sm:flex-row items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center mb-2 sm:mb-0 sm:mr-2">
                  <MapPin size={iconSize} className={iconClassName} />
                  <Label htmlFor="farmLocation">Farm Location</Label>
                </div>
                <Input
                  id="farmLocation"
                  placeholder="Detailed farm location"
                  value={formData.farmLocation || ""}
                  onChange={(e) =>
                    handleInputChange("farmLocation", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Nearby Landmarks */}
            <div className="space-y-2 flex flex-col sm:flex-row items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center mb-2 sm:mb-0 sm:mr-2">
                  <Landmark size={iconSize} className={iconClassName} />
                  <Label htmlFor="nearbyLandmarks">Nearby Landmarks</Label>
                </div>
                <Textarea
                  id="nearbyLandmarks"
                  placeholder="Describe nearby landmarks"
                  value={formData.nearbyLandmarks?.join(", ") || ""}
                  onChange={(e) => {
                    const landmarks = e.target.value
                      .split(",")
                      .map((l) => l.trim());
                    handleInputChange("nearbyLandmarks", landmarks);
                  }}
                />
              </div>
            </div>

            {/* GPS Address */}
            <div className="space-y-2 flex flex-col sm:flex-row items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center mb-2 sm:mb-0 sm:mr-2">
                  <Compass size={iconSize} className={iconClassName} />
                  <Label htmlFor="gpsAddress">GPS Address</Label>
                </div>
                <Input
                  id="gpsAddress"
                  placeholder="GPS coordinates (optional)"
                  value={formData.gpsAddress || ""}
                  onChange={(e) =>
                    handleInputChange("gpsAddress", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Farm Size */}
            <div className="space-y-2 flex flex-col sm:flex-row items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center mb-2 sm:mb-0 sm:mr-2">
                  <Ruler size={iconSize} className={iconClassName} />
                  <Label htmlFor="farmSize">Farm Size (in acres)</Label>
                </div>
                <Input
                  id="farmSize"
                  type="number"
                  placeholder="Total farm area in acres"
                  value={formData.farmSize || 0}
                  onChange={(e) =>
                    handleInputChange("farmSize", Number(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            {/* Production Scale */}
            <div className="space-y-2 flex flex-col sm:flex-row items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center mb-2 sm:mb-0 sm:mr-2">
                  <BarChart size={iconSize} className={iconClassName} />
                  <Label>Production Scale</Label>
                </div>
                <Select
                  value={formData.productionScale || "Small"}
                  onValueChange={(value) =>
                    handleInputChange("productionScale", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select production scale" />
                  </SelectTrigger>
                  <SelectContent>
                    {productionScaleOptions.map((scale) => (
                      <SelectItem key={scale} value={scale}>
                        {scale}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Image Upload Section - Responsive */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            {/* Mobile Toggle for Image Upload */}
            <button
              onClick={() => setIsImageUploadExpanded(!isImageUploadExpanded)}
              className="lg:hidden w-full py-2 bg-primary/10 rounded-md mb-4 flex items-center justify-center"
            >
              <CloudUpload className="mr-2" />
              {isImageUploadExpanded ? "Collapse" : "Expand"} Farm Images
            </button>

            {/* Image Upload Content - Responsive Display */}
            <div
              className={`
              w-full 
              ${isImageUploadExpanded || "hidden"} 
              lg:block
            `}
            >
              <Label className="mt-4 mb-3 text-center w-full block">
                Farm Images (Up to 5)
              </Label>
              <div className="flex flex-col items-center justify-center w-full">
                <label
                  htmlFor="farmImageUpload"
                  className="flex flex-col items-center justify-center w-full h-48 lg:h-64 border-2 border-gray-300 dark:border-gray-800 border-dashed rounded-lg cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 dark:text-gray-600 text-center px-4">
                    <CloudUpload className="w-10 h-10 mb-3" />
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs">
                      PNG, JPG, or GIF (MAX. 5MB, up to 5 images)
                    </p>
                  </div>
                  <input
                    id="farmImageUpload"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* Image Preview Section - Responsive Grid */}
              {farmImageFiles.length > 0 && (
                <div className="w-full grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-2 mt-2">
                  {farmImageFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg">
                        <AvatarImage
                          src={URL.createObjectURL(file)}
                          alt={`Farm preview ${index + 1}`}
                        />
                        <AvatarFallback>
                          <CloudUpload className="w-6 h-6 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => removeImage(file)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmInformationSection;
