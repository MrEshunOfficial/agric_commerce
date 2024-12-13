import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { FarmProfileData } from "@/store/type/formtypes";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DynamicPageProps {
  filteredFarms: FarmProfileData[];
}

export const DynamicPage: React.FC<DynamicPageProps> = ({ filteredFarms }) => {
  return (
    <div className="w-full h-full p-2">
      {filteredFarms.length > 0 ? (
        <>
          <small className="text-start text-gray-500">
            Registered farms: {filteredFarms.length}
          </small>
          <ScrollArea className="h-[310px] w-full my-2">
            <div className="w-full flex flex-col gap-3">
              {filteredFarms.map((farm: FarmProfileData) => (
                <Link
                  href={`/profile/shared_profile/${farm._id}`}
                  key={farm._id}
                  className="border rounded-lg p-2 shadow-md hover:bg-background transition-shadow"
                >
                  <div className="mb-2">
                    <div className="hover:text-blue-600">
                      <h3 className="font-semibold">{farm.farmName}</h3>
                      <small className="text-gray-600">
                        Location: {farm.farmLocation}
                      </small>
                    </div>
                  </div>
                  <div className="mt-3 border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">
                        Scale: {farm.productionScale}
                      </span>
                      <span className="text-xs text-gray-500">
                        Size: {farm.farmSize} acres
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center gap-4 h-full border rounded-md p-6 bg-white shadow-lg">
          <p className="leading-7 [&:not(:first-child)]:mt-2">
            No farm listed yet <span className="text-xl">😉</span>
          </p>
          <Button variant="default" className="w-full">
            <Link
              href="/profile/shared_profile/farm.profile.form"
              className="w-full h-full"
            >
              Add a Farm
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
