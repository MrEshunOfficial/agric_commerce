import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Icons
import { Upload, Trash2 } from "lucide-react";

export const ProductImageUpload = ({ form }: { form: any }) => {
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any[]) => void,
    currentImages: any[]
  ) => {
    const files = event.target.files;
    if (files) {
      // Convert FileList to Array
      const newFiles = Array.from(files);

      // Combine with existing files, preventing duplicates
      const updatedFiles = [
        ...productImageFiles,
        ...newFiles.filter(
          (newFile) =>
            !productImageFiles.some(
              (existingFile) => existingFile.name === newFile.name
            )
        ),
      ];

      // Limit to 5 images
      const limitedFiles = updatedFiles.slice(0, 5);
      setProductImageFiles(limitedFiles);

      // Process image URLs for preview and form data
      const imageUrls = limitedFiles.map((file) => {
        const reader = new FileReader();
        return new Promise<{ url: string; fileName: string; file: File }>(
          (resolve) => {
            reader.onloadend = () => {
              resolve({
                url: reader.result as string,
                fileName: file.name,
                file: file,
              });
            };
            reader.readAsDataURL(file);
          }
        );
      });

      // Update form with image URLs
      Promise.all(imageUrls).then((urls) => {
        onChange(urls);
      });
    }
  };

  const removeImage = (fileToRemove: File) => {
    const updatedFiles = productImageFiles.filter(
      (file) => file !== fileToRemove
    );
    setProductImageFiles(updatedFiles);

    // Convert files to image objects synchronously
    const productImages = updatedFiles.map((file) => {
      const reader = new FileReader();
      return new Promise<{ url: string; fileName: string; file: File }>(
        (resolve) => {
          reader.onloadend = () => {
            resolve({
              url: reader.result as string,
              fileName: file.name,
              file: file,
            });
          };
          reader.readAsDataURL(file);
        }
      );
    });

    // Use Promise.all to resolve all image promises
    Promise.all(productImages).then((resolvedImages) => {
      form.setValue("add_images", resolvedImages);
    });
  };

  return (
    <FormField
      control={form.control}
      name="add_images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <div className="flex items-center gap-3 w-full">
              {field.value && field.value.length > 0 && (
                <div className="w-full grid grid-cols-5 gap-2">
                  {field.value.map(
                    (
                      image: {
                        url: string | undefined;
                        fileName: string | undefined;
                        file: any;
                      },
                      index: React.Key | null | undefined
                    ) => (
                      <div key={index} className="relative group">
                        <div className="relative">
                          <Avatar className="w-32 h-32">
                            <AvatarImage
                              src={image.url}
                              alt={image.fileName}
                              className="object-cover rounded-lg"
                            />
                            <AvatarFallback>
                              <span className="text-sm font-medium text-gray-500">
                                {image.fileName?.toUpperCase() || "?"}
                              </span>
                            </AvatarFallback>
                          </Avatar>
                          <button
                            type="button"
                            onClick={() => {
                              const fileToRemove = image.file;
                              removeImage(fileToRemove);
                            }}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 text-white rounded-full p-2 hover:bg-red-600 transition-colors flex items-center justify-center"
                          >
                            <Trash2
                              size={18}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    <Upload className="w-6 h-6 mb-2 text-gray-400" />
                    <p className="mb-1 text-xs text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, or WebP (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e, field.onChange, field.value || [])
                    }
                  />
                </label>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
