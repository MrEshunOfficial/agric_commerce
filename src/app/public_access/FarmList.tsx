"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppDispatch, RootState } from "@/store";
import { FarmProfileData } from "@/store/type/formtypes";
import { fetchFarmProfiles } from "@/store/farmSlice";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

const FarmList: React.FC = () => {
  const { farmProfiles, loading, error } = useSelector(
    (state: RootState) => state.farmProfiles
  );
  // use session
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFarmProfiles({}));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            className="rounded-md transition-all duration-300 border"
          >
            <CardContent className="flex items-center space-x-4 p-2 rounded-md group">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading farm profiles: {error}
      </div>
    );
  }

  if (!farmProfiles || farmProfiles.length === 0) {
    return (
      <div className="text-center py-4 text-lg">No farm profiles found.</div>
    );
  }

  return (
    <Card className="w-full p-2 border-none">
      <CardHeader className="text-md font-bold mb-2 p-0">
        <span>Registered Farms</span>
      </CardHeader>
      <CardDescription>
        {farmProfiles.length > 0 && (
          <small className="text-start text-gray-500">
            Total registered farms: {farmProfiles.length}
          </small>
        )}
      </CardDescription>
      <ScrollArea className="h-[350px] w-full my-2">
        <CardContent className="w-full flex flex-col gap-3 p-1">
          {farmProfiles.map((farm: FarmProfileData) => (
            <motion.div
              key={farm._id}
              whileHover={{
                scale: 1.025,
                backgroundColor: "rgba(0,0,0,0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              className="rounded-md transition-all duration-300"
            >
              <Link
                href={`${
                  farm.userId !== session?.user?.id
                    ? `/public_access/public_profile/${farm.userId}/${farm._id}`
                    : `/profile/shared_profile/${farm._id}`
                }`}
                className="flex items-center space-x-4 p-2 hover:bg-accent/10 rounded-md group border"
              >
                {farm.farmImages && farm.farmImages.length > 0 ? (
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage
                      src={farm.farmImages[0].url}
                      alt={`${farm.farmName} farm preview`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {farm.farmName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-12 h-12 bg-primary/10">
                    <AvatarFallback className="text-primary">
                      {farm.farmName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors capitalize">
                    {farm.farmName}
                  </h3>
                  <p className="text-xs text-muted-foreground w-full flex items-center justify-between">
                    <span>{farm.farmLocation || "Location not specified"}</span>
                    <span>size: {farm.farmSize} acre(s)</span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default FarmList;
