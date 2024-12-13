"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

import { AppDispatch, RootState } from "@/store";
import {
  fetchFarmProfiles,
  fetchFarmProfileById,
  setCurrentProfile,
} from "@/store/farmSlice";

import FarmInformationDetails from "@/app/profile/shared_profile/farm.list.components/FarmInformationList";
import FarmerInformationDetails from "@/app/profile/shared_profile/farm.list.components/FarmerOwnerInformationList";
import CooperativeDetails from "@/app/profile/shared_profile/farm.list.components/CooperativeDetails";

interface FarmDetailsPageProps {
  farmId?: string; // Optional prop to allow passing farmId directly
}

const FarmDetailsPage: React.FC<FarmDetailsPageProps> = ({
  farmId: propFarmId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  // Prioritize prop farmId, fallback to params, with type safety
  const farmId = propFarmId ?? (params?.farmId as string);

  const { farmProfiles, currentProfile, loading } = useSelector(
    (state: RootState) => state.farmProfiles
  );

  // Fetch farm profiles on component mount
  useEffect(() => {
    dispatch(fetchFarmProfiles({}));
  }, [dispatch]);

  // Fetch specific farm profile when farmId changes
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!farmId) {
        toast({
          title: "Invalid Farm ID",
          description: "No farm ID provided.",
          variant: "destructive",
        });
        return;
      }

      try {
        await dispatch(fetchFarmProfileById(farmId)).unwrap();
      } catch (error) {
        toast({
          title: "Error Fetching Profiles",
          description: String(error),
          variant: "destructive",
        });
      }
    };

    fetchProfiles();
  }, [dispatch, farmId]);

  // Set current profile based on fetched profiles
  useEffect(() => {
    if (farmProfiles.length > 0 && farmId) {
      const profile = farmProfiles.find((profile) => profile._id === farmId);
      if (profile) {
        dispatch(setCurrentProfile(profile));
      } else {
        toast({
          title: "Farm Profile Not Found",
          description: "The specified farm profile does not exist.",
          variant: "destructive",
        });
      }
    }
  }, [farmProfiles, farmId, dispatch]);

  // Handle profile sharing
  const handleShareProfile = () => {
    if (currentProfile) {
      const farmImage = currentProfile.farmImages?.[0] ?? "No image available";
      const shareText =
        `${farmImage}\n` +
        `Farm Name: ${currentProfile.farmName}\n` +
        `Location: ${currentProfile.farmLocation}\n` +
        `Farm Size: ${currentProfile.farmSize} acres\n` +
        `Farmer Contact: ${currentProfile.contactPhone}\n` +
        `Primary Crops/Livestock: ${
          currentProfile.cropsGrown?.join(", ") ?? "Not specified"
        }`;

      // Use Web Share API if available
      if (navigator.share) {
        navigator
          .share({
            title: `Farm Profile: ${currentProfile.farmName}`,
            text: shareText,
          })
          .catch(console.error);
      } else {
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: "Profile Copied",
            description: "Farm profile details copied to clipboard.",
            variant: "default",
          });
        });
      }
    }
  };

  // Loading state
  if (loading || !farmId) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading farm profile...
        </motion.div>
      </div>
    );
  }

  // No current profile state
  if (!currentProfile) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Farm profile not found.
        </motion.div>
      </div>
    );
  }

  // Render farm details
  return (
    <motion.div
      className="flex-1 h-[auto] bg-gradient-to-br from-primary/10 to-primary/5 p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full h-full flex flex-col shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/10 p-4 flex flex-row justify-between items-center border-b">
          <motion.h1
            className="font-bold text-gray-900 dark:text-gray-100 capitalize"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {`Details of ${currentProfile.farmName}`}
          </motion.h1>
        </CardHeader>
        <CardContent className="flex flex-1 p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row w-full h-[66vh] overflow-hidden"
            >
              {/* Farm Details Section */}
              <div className="flex-1 p-2 overflow-y-auto">
                <Tabs defaultValue="farmInfo" className="w-full">
                  <TabsList className="w-full flex items-center justify-between gap-3 sticky top-0 left-0 right-0 py-2">
                    <TabsTrigger value="farmInfo">Farm Info</TabsTrigger>
                    <TabsTrigger value="farmerInfo">Farmer Info</TabsTrigger>
                    <TabsTrigger value="cooperative">Cooperative</TabsTrigger>
                    <motion.div
                      className="flex-1 flex justify-end p-2 gap-2"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShareProfile}
                        title="Share Farm Profile"
                      >
                        <Share2 size={16} />
                      </Button>
                    </motion.div>
                  </TabsList>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <TabsContent value="farmInfo">
                      <FarmInformationDetails profile={currentProfile} />
                    </TabsContent>
                    <TabsContent value="farmerInfo">
                      <FarmerInformationDetails profile={currentProfile} />
                    </TabsContent>
                    <TabsContent value="cooperative">
                      <CooperativeDetails profile={currentProfile} />
                    </TabsContent>
                  </motion.div>
                </Tabs>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      <Toaster />
    </motion.div>
  );
};

export default FarmDetailsPage;
