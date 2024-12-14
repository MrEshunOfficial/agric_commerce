"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tractor, Share2, Pencil, Trash2 } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFarmProfile,
  updateFarmProfile,
  setCurrentProfile,
  fetchFarmProfileById,
} from "@/store/farmSlice";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/toaster";
import { useParams, useRouter } from "next/navigation";
import FarmInformationDetails from "../farm.list.components/FarmInformationList";
import FarmerInformationDetails from "../farm.list.components/FarmerOwnerInformationList";
import CooperativeDetails from "../farm.list.components/CooperativeDetails";
import Link from "next/link";

export default function FarmDetailsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const farmId = params.id as string;

  const { farmProfiles, currentProfile, loading } = useSelector(
    (state: RootState) => state.farmProfiles
  );

  // Fetch farm profiles and set current profile on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
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

  // Set current profile when farmProfiles or farmId changes
  useEffect(() => {
    if (farmProfiles.length > 0 && farmId) {
      const profile = farmProfiles.find((profile) => profile._id === farmId);
      if (profile) {
        dispatch(setCurrentProfile(profile));
      } else {
        // Redirect or show error if farm profile not found
        toast({
          title: "Farm Profile Not Found",
          description: "The specified farm profile does not exist.",
          variant: "destructive",
        });
        router.push("/profile/farmer_profile/farm.profile.form"); // Redirect to farms list
      }
    }
  }, [farmProfiles, farmId, dispatch, router]);

  const handleEditProfile = async () => {
    if (currentProfile && currentProfile._id) {
      try {
        await dispatch(
          updateFarmProfile({
            id: currentProfile._id,
            profileData: currentProfile,
          })
        ).unwrap();
        toast({
          title: "Profile Ready for Editing",
          description: "Your farm profile is now in edit mode",
        });
      } catch (error) {
        toast({
          title: "Edit Profile Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to prepare profile for editing",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Edit Profile Error",
        description: "No profile selected or profile ID missing",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProfile = () => {
    if (currentProfile?._id) {
      dispatch(deleteFarmProfile(currentProfile._id))
        .then((result) => {
          if (deleteFarmProfile.fulfilled.match(result)) {
            toast({
              title: "Farm Profile Deleted",
              description: `${currentProfile.farmName} has been successfully deleted.`,
              variant: "default",
            });
            router.push("/profile/shared_profile"); // Redirect after deletion
          } else if (deleteFarmProfile.rejected.match(result)) {
            console.error("Delete Action Rejected:", result.payload);
            toast({
              title: "Delete Failed",
              description:
                typeof result.payload === "string"
                  ? result.payload
                  : "An error occurred while deleting the farm profile.",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error("Unexpected Delete Error:", error);
          toast({
            title: "Delete Failed",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Delete Failed",
        description: "No profile selected or profile ID missing.",
        variant: "destructive",
      });
    }
  };

  // Handle share functionality (basic implementation)
  const handleShareProfile = () => {
    if (currentProfile) {
      const farmImage = currentProfile.farmImages?.[0] ?? "No image available";
      const shareText =
        `${farmImage}\n` +
        `Farm Name: ${currentProfile.farmName}\n` +
        `Location: ${currentProfile.farmLocation}\n` +
        `Farm Size: ${currentProfile.farmSize} acres\n` +
        `Farmer Contact: ${currentProfile.contactPhone}\n`;

      // Use Web Share API if available
      if (navigator.share) {
        navigator
          .share({
            title: `Farm Profile: ${currentProfile.farmName}`,
            text: shareText,
          })
          .catch(console.error);
      } else {
        // Fallback: Copy to clipboard
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

  // If no current profile is loaded yet, show a loading state
  if (!currentProfile) {
    return (
      <div className="flex justify-center items-center h-full">
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

  return (
    <motion.div
      className="h-auto w-full flex flex-col bg-gradient-to-br from-primary/10 to-primary/5 p-2 md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full flex flex-col shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/10 p-4 flex flex-col sm:flex-row justify-between items-center border-b space-y-2 sm:space-y-0">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300 w-full sm:w-auto text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 flex flex-col sm:flex-row items-center">
              <span className="mr-0 sm:mr-2 mb-1 sm:mb-0">Details of</span>
              <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-md tracking-wide capitalize">
                {currentProfile.farmName}
              </span>
            </h2>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex-wrap p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col w-full min-h-[400px] md:h-[66vh] overflow-hidden"
            >
              {/* Farm Details Section */}
              <div className="flex-1 p-2 overflow-y-auto">
                <div className="w-full">
                  <Tabs defaultValue="farmInfo" className="w-full">
                    <TabsList className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-0 left-0 right-0 py-2 space-y-2 sm:space-y-0">
                      <div className="flex w-full sm:w-auto justify-center sm:justify-start space-x-2">
                        <TabsTrigger
                          value="farmInfo"
                          className="w-full sm:w-auto"
                        >
                          Farm Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="farmerInfo"
                          className="w-full sm:w-auto"
                        >
                          Farmer Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="cooperative"
                          className="w-full sm:w-auto"
                        >
                          Cooperative
                        </TabsTrigger>
                      </div>

                      <motion.div
                        className="flex w-full sm:w-auto justify-center sm:justify-end p-2 gap-2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={handleShareProfile}
                          title="Share Farm Profile"
                        >
                          <Share2 size={16} />
                          <span className="sm:hidden ml-2">Share</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={handleEditProfile}
                          title="Edit Farm Profile"
                        >
                          <Pencil size={16} />
                          <span className="sm:hidden ml-2">Edit</span>
                        </Button>
                        <AlertDialog
                          open={isDeleteDialogOpen}
                          onOpenChange={setIsDeleteDialogOpen}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              title="Delete Farm Profile"
                              className="text-white w-full sm:w-auto"
                            >
                              <Trash2 size={16} />
                              <span className="sm:hidden ml-2">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the farm profile
                                for <strong>{currentProfile.farmName}</strong>.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteProfile}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={loading}
                              >
                                {loading ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </motion.div>
                    </TabsList>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="w-full"
                    >
                      <TabsContent value="farmInfo" className="w-full">
                        <FarmInformationDetails profile={currentProfile} />
                      </TabsContent>
                      <TabsContent value="farmerInfo" className="w-full">
                        <FarmerInformationDetails profile={currentProfile} />
                      </TabsContent>
                      <TabsContent value="cooperative" className="w-full">
                        <CooperativeDetails profile={currentProfile} />
                      </TabsContent>
                    </motion.div>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      <Toaster />
    </motion.div>
  );
}
