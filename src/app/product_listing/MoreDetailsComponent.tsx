"use client";
import React from "react";
import { Beef, MapPin, TractorIcon, WheatIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PostData } from "@/store/type/post.types";
import { cn } from "@/lib/utils";
import moment from "moment";

export const MoreDetailsComponent: React.FC<{ filteredPost: PostData }> = ({
  filteredPost,
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
        Additional Details
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Bulk Discount
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {filteredPost.pricing.bulk_discount
                ? `${filteredPost.pricing.bulk_discount}`
                : "No bulk discount"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Pricing Flexibility
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                filteredPost.pricing.negotiable
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {filteredPost.pricing.negotiable
                ? "Negotiable"
                : "Non-negotiable"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Harvest Status
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                filteredPost.harvest_details.harvest_ready
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-800 dark:text-gray-200"
              )}
            >
              {filteredPost.harvest_details.harvest_ready
                ? "Harvest Ready"
                : moment(filteredPost.harvest_details.harvest_date).format(
                    "LLL"
                  ) || "Not specified"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Quality Grade
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {filteredPost.harvest_details.quality_grade || "Not rated"}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Posted On
          </span>
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {moment(filteredPost.posted_at).format("LLLL") ||
              "Date not available"}
          </span>
        </div>
      </div>
    </div>
  );
};

interface ProductInformationProps {
  filteredPost: PostData;
  className?: string;
}

export const ProductInformation: React.FC<ProductInformationProps> = ({
  filteredPost,
  className,
}) => {
  const { product } = filteredPost;

  // Format price with currency formatting
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border border-gray-100 dark:border-gray-700",
        className
      )}
    >
      <h2 className="font-bold text-green-800 dark:text-green-300 mb-4 pb-2 border-b-2 border-green-500 dark:border-green-700 uppercase tracking-wide">
        Product Information
      </h2>
      <div className="shadow-sm rounded-lg border border-gray-100 capitalize">
        <div className="flex flex-col items-start gap-3">
          <Badge variant="secondary" className="rounded-md">
            <span className="font-semibold mr-2">Item:</span>
            <span>{product.item}</span>
          </Badge>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-md">
              <span className="font-semibold mr-2">Quantity:</span>
              <span>
                {product.quantity} {product.unit}
              </span>
            </Badge>

            <Badge
              variant="outline"
              className={cn(
                "capitalize rounded-md font-medium",
                product.status
                  ? "text-green-700 bg-green-50 border-green-200"
                  : "text-red-700 bg-red-50 border-red-200"
              )}
            >
              {product.status ? "Available" : "Sold"}
            </Badge>
          </div>

          <Badge variant="secondary" className="rounded-md">
            <span className="font-semibold mr-2">Price:</span>
            <span>
              {formattedPrice}/{product.unit}
            </span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export const FarmInformation: React.FC<{ filteredPost: PostData }> = ({
  filteredPost,
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-sm font-bold text-green-800 dark:text-green-300 mb-4 pb-2 border-b-2 border-green-500 dark:border-green-700 uppercase tracking-wide">
        Farm Information
      </h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <TractorIcon
            className="text-green-600 dark:text-green-400 shrink-0"
            size={18}
          />
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">
              Farm Type:
            </span>
            <span className="ml-2 capitalize text-gray-800 dark:text-gray-200">
              {filteredPost.farmType} farming
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <MapPin
            className="text-blue-600 dark:text-blue-400 shrink-0"
            size={18}
          />
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">
              Location:
            </span>
            <span className="ml-2 text-gray-800 dark:text-gray-200">
              {filteredPost.farmLocation}
            </span>
          </div>
        </div>

        {filteredPost.cropFarmingType && (
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <WheatIcon
              className="text-yellow-600 dark:text-yellow-400 shrink-0"
              size={18}
            />
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Crop Type:
              </span>
              <span className="ml-2 capitalize text-gray-800 dark:text-gray-200">
                {filteredPost.cropFarmingType}
              </span>
            </div>
          </div>
        )}

        {filteredPost.livestockType && (
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Beef
              className="text-red-600 dark:text-red-400 shrink-0"
              size={24}
            />
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Livestock Type:
              </span>
              <span className="ml-2 capitalize text-gray-800 dark:text-gray-200">
                {filteredPost.livestockType}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
