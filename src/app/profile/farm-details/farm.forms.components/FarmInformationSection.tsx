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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Defining the props type for type safety
interface FarmInformationSectionProps {
  formData: Partial<FarmProfileData>;
  updateFormSection: (data: Partial<FarmProfileData>) => void;
}

const FarmInformationSection: React.FC<FarmInformationSectionProps> = ({
  formData,
  updateFormSection,
}) => {
  // Local state for multiple file uploads
  const [farmImageFiles, setFarmImageFiles] = useState<File[]>([]);

  // Handler for input changes
  const handleInputChange = (
    field: keyof FarmProfileData,
    value: string | number | string[]
  ) => {
    updateFormSection({ [field]: value });
  };

  // Handler for multiple file uploads
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Convert FileList to Array
      const newFiles = Array.from(files);

      // Combine with existing files, preventing duplicates
      const updatedFiles = [
        ...farmImageFiles,
        ...newFiles.filter(
          (newFile) =>
            !farmImageFiles.some(
              (existingFile) => existingFile.name === newFile.name
            )
        ),
      ];

      // Limit to 5 images
      const limitedFiles = updatedFiles.slice(0, 5);
      setFarmImageFiles(limitedFiles);

      // Process image URLs for preview and form data
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

      // Update form data with image URLs
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

    // Convert files to image objects synchronously
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

    // Use Promise.all to resolve all image promises
    Promise.all(farmImages).then((resolvedImages) => {
      updateFormSection({
        farmImages: resolvedImages,
      });
    });
  };

  // Available production scale options
  const productionScaleOptions = Object.values(ProductionScale);
  const iconClassName = "text-muted-foreground mr-2";
  const iconSize = 18;

  return (
    <Card className="w-full h-auto">
      <CardContent className="w-full flex items-start justify-center gap-4">
        <div className="flex-1 grid grid-cols-2 gap-4 p-2 max-h-[35vh] overflow-auto">
          {/* Farm Name Input */}
          <div className="space-y-2 flex items-center">
            <Home size={iconSize} className={iconClassName} />
            <div className="flex-1">
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                placeholder="Enter your farm name"
                value={formData.farmName || ""}
                onChange={(e) => handleInputChange("farmName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Farm Location Input */}
          <div className="space-y-2 flex items-center">
            <MapPin size={iconSize} className={iconClassName} />
            <div className="flex-1">
              <Label htmlFor="farmLocation">Farm Location</Label>
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
          <div className="space-y-2 flex items-center">
            <Landmark size={iconSize} className={iconClassName} />
            <div className="flex-1">
              <Label htmlFor="nearbyLandmarks">Nearby Landmarks</Label>
              <Textarea
                id="nearbyLandmarks"
                placeholder="Describe nearby landmarks that help locate your farm"
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
          <div className="space-y-2 flex items-center">
            <Compass size={iconSize} className={iconClassName} />
            <div className="flex-1">
              <Label htmlFor="gpsAddress">GPS Address</Label>
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
          <div className="space-y-2 flex items-center">
            <Ruler size={iconSize} className={iconClassName} />
            <div className="flex-1">
              <Label htmlFor="farmSize">Farm Size (in acres)</Label>
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
          <div className="space-y-2 flex items-center">
            <BarChart size={iconSize} className={iconClassName} />
            <div className="flex-1">
              <Label>Production Scale</Label>
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

        {/* Farm Image Upload */}
        <div className="w-1/3 flex flex-col items-center">
          <Label className="mt-4 mb-3">Farm Images (Up to 5)</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="farmImageUpload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-800  border-dashed rounded-lg cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 dark:text-gray-600">
                <CloudUpload className="w-10 h-10 mb-3" />
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
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

          {/* Image Preview Section */}
          {farmImageFiles.length > 0 && (
            <div className="w-full grid grid-cols-3 gap-2 mt-2">
              {farmImageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <Avatar className="w-20 h-20 rounded-lg">
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
      </CardContent>
    </Card>
  );
};

export default FarmInformationSection;
