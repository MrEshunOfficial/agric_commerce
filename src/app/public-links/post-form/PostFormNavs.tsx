"use client";
import React from "react";
import {
  User,
  Tag,
  Mail,
  Phone,
  Loader2,
  ExternalLinkIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Store and Validation
import { FarmProfileData } from "@/store/type/formtypes";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";
import { Session } from "next-auth";

// Define props type for FarmProfileSidebar
type FarmProfileSidebarProps = {
  selectedFarm: FarmProfileData | null;
  session: Session | null;
};

// Define props type for DetailRow
type DetailRowProps = {
  label: string;
  value: string | string[];
};

// Utility Component for Consistent Detail Rows
const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div
    className="flex justify-between 
    border-b border-gray-100 dark:border-gray-700 
    pb-1"
  >
    <strong className="text-gray-600 dark:text-gray-400">{label}:</strong>
    <span className="text-gray-800 dark:text-gray-200 capitalize">{value}</span>
  </div>
);

export const FarmProfileSidebar: React.FC<FarmProfileSidebarProps> = ({
  selectedFarm,
  session,
}) => {
  if (!selectedFarm) {
    return (
      <aside
        className="w-full h-full p-4 border border-dashed rounded-lg 
        bg-gray-50 dark:bg-gray-800 
        border-gray-200 dark:border-gray-700
        flex items-center justify-center"
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
          No farm profile selected
        </p>
      </aside>
    );
  }

  return (
    <aside
      className="w-full h-full p-4 
      border border-gray-200 dark:border-gray-700 
      rounded-lg shadow-sm dark:shadow-none
      bg-white dark:bg-gray-900 
      transition-all duration-300 
      hover:shadow-md dark:hover:bg-gray-800"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Farm Avatar */}
        <div className="relative group">
          <Avatar
            className="w-40 h-40 
            border-3 border-primary/20 
            ring-2 ring-primary/10 
            dark:ring-primary/30 
            group-hover:ring-primary/30 
            dark:group-hover:ring-primary/50 
            transition-all duration-300"
          >
            {selectedFarm.farmImages && selectedFarm.farmImages.length > 0 ? (
              <AvatarImage
                src={selectedFarm.farmImages[0].url}
                alt={`${selectedFarm.farmName} farm`}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : null}
            <AvatarFallback
              className="
              bg-primary/10 dark:bg-primary/20 
              text-primary text-4xl font-bold"
            >
              {selectedFarm.farmName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Farm Name and Location */}
        <div className="text-center space-y-1">
          <h2
            className="text-xl font-semibold 
            text-gray-800 dark:text-gray-200 
            capitalize"
          >
            {selectedFarm.farmName}
          </h2>
          <p
            className="text-sm 
            text-gray-500 dark:text-gray-400"
          >
            {selectedFarm.farmLocation || "Location not specified"}
          </p>
        </div>

        <div
          className="w-full space-y-2 text-sm 
    text-gray-700 dark:text-gray-300"
        >
          <DetailRow
            label="Farm Size"
            value={`${selectedFarm.farmSize} acres`}
          />
          <DetailRow
            label="Farm Type"
            value={selectedFarm.farmType || "Not specified"}
          />
          {selectedFarm.cropsGrown && (
            <DetailRow label="Crop Type" value={selectedFarm.cropsGrown} />
          )}
          {selectedFarm.livestockProduced && (
            <DetailRow
              label="Livestock"
              value={selectedFarm.livestockProduced}
            />
          )}
        </div>

        {/* View Profile Button */}
        <Button variant="default" className="w-full mt-4">
          <Link
            href={`${
              selectedFarm.userId !== session?.user?.id
                ? `/public_access/public_profile/${selectedFarm.userId}/${selectedFarm._id}`
                : `/profile/shared_profile/${selectedFarm._id}`
            }`}
            className="w-full flex items-center justify-center space-x-2 text-sm"
          >
            <span>View Farm Profile</span>
            <ExternalLinkIcon size={16} />
          </Link>
        </Button>

        {/* Additional Info */}
        <div
          className="w-full p-3 
          bg-gray-50 dark:bg-gray-800 
          rounded-md text-center 
          text-xs 
          text-gray-500 dark:text-gray-400 
          mt-2"
        >
          Details of <b>{selectedFarm.farmName}</b> will be added to the ad
          after posting
        </div>
      </div>
    </aside>
  );
};

export const FormNavigation: React.FC<{
  userProfile: any;
  farmProfiles: FarmProfileData[];
  handleFarmSelect: (farm: FarmProfileData) => void;
}> = ({ userProfile, farmProfiles, handleFarmSelect }) => {
  return (
    <nav className="w-full h-full flex flex-col gap-2 p-2 border border-gray-300 dark:border-gray-800 rounded-md">
      {/* Profile Section */}
      <div className="w-full flex-1 border rounded-md p-2">
        {userProfile ? (
          <div className="flex flex-col gap-2 items-center mb-2">
            <Avatar className="h-40 w-full border-primary-500 rounded-md relative">
              <AvatarImage
                src={
                  userProfile?.profilePicture ||
                  "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                alt={userProfile?.username}
                className="object-cover"
              />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>

              {/* Username and Role */}
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 p-4 rounded-b-md w-full">
                <h1 className="font-bold">{userProfile?.fullName}</h1>
                <p className="text-sm flex items-center gap-2 capitalize">
                  <Tag size={16} /> {userProfile.username} • {userProfile.role}
                </p>
              </div>
            </Avatar>
            <p className="text-sm w-full flex flex-col items-start gap-1 capitalize">
              <span className="flex items-center gap-2">
                <Phone size={16} /> {userProfile.phoneNumber}
              </span>
              <span className="flex items-center gap-2">
                <Mail size={16} /> {userProfile.email}
              </span>
            </p>
          </div>
        ) : (
          <p className="w-full h-full flex items-center justify-center text-center text-sm text-muted-foreground">
            <Loader2 size={18} className="animate-spin" />
          </p>
        )}
      </div>
      <div className="w-full flex-1 flex flex-col">
        {userProfile &&
        userProfile.role === "Farmer" &&
        farmProfiles.length === 0 ? (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center rounded-md text-muted-foreground">
            <FarmProfilePrompt />
          </div>
        ) : (
          <div className="w-full">
            <h1 className="text-md font-bold">Registered Farms</h1>
            {farmProfiles.length > 0 && (
              <small className="text-start text-gray-500">
                Total registered farms: {farmProfiles.length}
              </small>
            )}

            <ScrollArea className="h-[350px] w-full my-2">
              <div className="w-full flex flex-col gap-3">
                {farmProfiles.map((farm: FarmProfileData) => (
                  <motion.div
                    key={farm._id}
                    whileHover={{
                      scale: 1.025,
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-md transition-all duration-300 cursor-pointer"
                    onClick={() => handleFarmSelect(farm)}
                  >
                    <div className="flex items-center space-x-4 p-2 hover:bg-accent/10 rounded-md group border">
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
                          <span>
                            {farm.farmLocation || "Location not specified"}
                          </span>
                          <span>size: {farm.farmSize} acre(s)</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </nav>
  );
};

const FarmProfilePrompt = () => {
  return (
    <Card className="w-full p-1">
      <CardContent className="flex flex-col items-center justify-center text-center space-y-2 pt-2">
        <div className="text-muted-foreground">
          <p className="text-sm">
            Farmers are required to add at least one farm profile
          </p>
          <p className="text-sm">
            No farms registered yet. You can create a new farm profile by
            clicking on the button below.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/profile/shared_profile/farm.profile.form">
            Create Farm Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
