import React, { useState } from "react";
import {
  MapPin,
  Ruler,
  Scale,
  Images,
  Map,
  Tractor,
  X,
  Building, // Added for Farm Name
  Navigation, // Added for GPS Address
  Trees, // Added for Nearby Landmarks
} from "lucide-react";
import { FarmProfileData } from "@/store/type/formtypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import FarmTypeDetails from "./FarmTypeList";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const FarmInformationDetails: React.FC<{ profile: FarmProfileData }> = ({
  profile,
}) => {
  const { currentProfile } = useSelector(
    (state: RootState) => state.farmProfiles
  );

  // State to manage the carousel visibility
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  if (!currentProfile) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No profile data available.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Tractor
              className="mr-3 text-emerald-600 dark:text-emerald-400"
              size={18}
            />
            Farm Details
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary Farm Information */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Building
                className="mr-3 text-blue-600 dark:text-blue-400"
                size={18}
              />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Farm Name
                </label>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {profile.farmName}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Map
                className="mr-3 text-green-600 dark:text-green-400"
                size={18}
              />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Location
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.farmLocation}
                </p>
              </div>
            </div>

            {profile.gpsAddress && (
              <div className="flex items-center">
                <Navigation
                  className="mr-3 text-purple-600 dark:text-purple-400"
                  size={18}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    GPS Address
                  </label>
                  <p className="text-base text-gray-900 dark:text-gray-100">
                    {profile.gpsAddress}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Farm Information */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Ruler
                className="mr-3 text-indigo-600 dark:text-indigo-400"
                size={18}
              />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Farm Size
                </label>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {profile.farmSize} acres
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Scale
                className="mr-3 text-red-600 dark:text-red-400"
                size={18}
              />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Production Scale
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.productionScale}
                </p>
              </div>
            </div>

            {profile.nearbyLandmarks && profile.nearbyLandmarks.length > 0 && (
              <div className="flex items-start">
                <Trees
                  className="mr-3 text-amber-600 dark:text-amber-400"
                  size={18}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Nearby Landmarks
                  </label>
                  <ul className="text-base text-gray-900 dark:text-gray-100 list-disc pl-4">
                    {profile.nearbyLandmarks.map((landmark, index) => (
                      <li key={index}>{landmark}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <FarmTypeDetails profile={currentProfile} />

        {/* Farm Images */}
        {profile.farmImages && profile.farmImages.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center border-t pt-4">
              <Images
                className="mr-3 text-cyan-600 dark:text-cyan-400"
                size={18}
              />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Farm Images
              </h4>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {profile.farmImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsCarouselOpen(true)}
                >
                  <Avatar className="w-full h-full object-cover rounded-lg">
                    <AvatarImage
                      src={image.url}
                      alt={`Farm preview ${index + 1}`}
                    />
                    <AvatarFallback>FP</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Carousel */}
      {isCarouselOpen &&
        profile.farmImages &&
        profile.farmImages.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="relative w-full max-w-4xl">
              <Button
                onClick={() => setIsCarouselOpen(false)}
                className="absolute -top-10 right-0 rounded-full"
                variant={"ghost"}
                size={"icon"}
              >
                <X size={18} />
              </Button>
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 4000,
                  }),
                ]}
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {profile.farmImages.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className="flex justify-center items-center"
                    >
                      <Avatar className="w-[30vh] h-[30vh] sm:w-[40vh] sm:h-[40vh] md:w-[50vh] md:h-[50vh] lg:w-[60vh] lg:h-[60vh] object-contain rounded-lg">
                        <AvatarImage
                          src={image.url}
                          alt={`Farm image ${index + 1}`}
                        />
                        <AvatarFallback>FP</AvatarFallback>
                      </Avatar>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="text-white bg-white/20 hover:bg-white/40" />
                <CarouselNext className="text-white bg-white/20 hover:bg-white/40" />
              </Carousel>
              <div className="text-center text-white mt-4">Farm Images</div>
            </div>
          </div>
        )}
    </>
  );
};

export default FarmInformationDetails;
