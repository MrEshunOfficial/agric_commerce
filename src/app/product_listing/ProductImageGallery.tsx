import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface ProductImageGalleryProps {
  images?: { url: string }[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (images.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images.length) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg">
        <ImageIcon className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video">
      <div className="relative w-full h-full group">
        <Avatar>
          <AvatarImage
            src={images[currentImageIndex].url}
            alt={`Product image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
          <AvatarFallback>
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16" />
            </div>
          </AvatarFallback>
        </Avatar>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="text-gray-800" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/50 hover:bg-white/75 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="mt-4 h-1/4 flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden ${
                index === currentImageIndex ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <Avatar>
                <AvatarImage
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>Image</AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
