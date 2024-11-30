"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tractor,
  X,
  Menu,
  Share2,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCurrentProfile,
  deleteFarmProfile,
  fetchFarmProfiles,
  setCurrentProfile,
  updateFarmProfile,
} from "@/store/farmSlice";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FarmProfileData } from "@/store/type/formtypes";
import FarmProfileForm from "./FarmProfileForm";
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
import FarmInformationDetails from "./farm.list.components/FarmInformationList";
import FarmerInformationDetails from "./farm.list.components/FarmerOwnerInformationList";
import CooperativeDetails from "./farm.list.components/CooperativeDetails";
import { Toaster } from "@/components/ui/toaster";

export default function FarmDetails() {
  const [isFormActive, setIsFormActive] = useState(false);
  const [isFarmListOpen, setIsFarmListOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { farmProfiles, currentProfile, loading, error } = useSelector(
    (state: RootState) => state.farmProfiles
  );

  // Auto-select farm on initial load or when farms change
  useEffect(() => {
    if (farmProfiles.length > 0) {
      if (farmProfiles.length === 1) {
        dispatch(setCurrentProfile(farmProfiles[0]));
      } else {
        // Select the most recently added farm
        const lastAddedFarm = farmProfiles[farmProfiles.length - 1];
        dispatch(setCurrentProfile(lastAddedFarm));
      }
    }
  }, [farmProfiles, dispatch]);

  // Handle farm selection
  const handleFarmSelect = (farm: FarmProfileData) => {
    dispatch(setCurrentProfile(farm));
    setIsFormActive(false);
    setIsFarmListOpen(false);
  };

  const handleEditProfile = async () => {
    if (currentProfile && currentProfile._id) {
      try {
        await dispatch(
          updateFarmProfile({
            id: currentProfile._id,
            profileData: currentProfile,
          })
        ).unwrap();

        setIsFormActive(true);

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

  // Enhanced delete profile handler
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
            setIsDeleteDialogOpen(false);
          } else if (deleteFarmProfile.rejected.match(result)) {
            // More detailed error logging
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
          // Catch any unexpected errors
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
        `Farmer Contact: ${currentProfile.contactPhone}\n` +
        `Primary Crops/Livestock: ${
          currentProfile.primaryCropsOrLivestock?.join(", ") ?? "Not specified"
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

  const renderFarmList = (farms: FarmProfileData[]) => (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {farms.map((farm) => (
        <motion.div
          key={farm._id || farm.farmName}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={
              currentProfile?.farmName === farm.farmName ? "secondary" : "ghost"
            }
            className="w-full justify-start gap-3"
            onClick={() => handleFarmSelect(farm)}
          >
            {farm.farmImages && farm.farmImages.length > 0 ? (
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={farm.farmImages[0].url}
                  alt={`${farm.farmName} farm preview`}
                />
                <AvatarFallback>{farm.farmName.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="w-10 h-10">
                <AvatarFallback>{farm.farmName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <span>{farm.farmName}</span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );

  const MobileFarmList = () => (
    <Sheet open={isFarmListOpen} onOpenChange={setIsFarmListOpen}>
      <SheetTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed bottom-4 right-4 z-50"
            onClick={() => setIsFarmListOpen(true)}
          >
            <Menu />
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">
            My Farms
            <span className="text-sm text-gray-500 ml-2">
              ({farmProfiles.length})
            </span>
          </h2>
          {renderFarmList(farmProfiles)}
        </div>
      </SheetContent>
    </Sheet>
  );

  if (!loading && farmProfiles.length === 0) {
    return (
      <motion.div
        className="h-[auto] bg-gradient-to-br from-primary/10 to-primary/5 p-2 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <h2 className="text-xl font-bold">No Farm Profiles Found</h2>
          </CardHeader>
          <CardContent className="w-full h-full flex flex-col gap-2 items-center justify-center p-2">
            <p className="mb-4">{`You don't have any farm profiles yet.`}</p>
            <div className="w-full h-full flex items-center justify-center">
              <FarmProfileForm />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="h-[auto] bg-gradient-to-br from-primary/10 to-primary/5 p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full h-full flex flex-col shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/10 p-4 flex flex-row justify-between items-center border-b">
          <motion.h1
            className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Farm Management
          </motion.h1>
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => {
                  setIsFormActive(!isFormActive);
                  dispatch(clearCurrentProfile());
                }}
                variant="outline"
                className="rounded-md"
              >
                {isFormActive ? (
                  <div className="flex items-center gap-2">
                    <X size={16} />
                    Close
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Tractor size={16} />
                    Add Farm
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {isFormActive ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full p-4 md:p-6"
              >
                <FarmProfileForm />
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row w-full h-[66vh] overflow-hidden"
              >
                {/* Desktop Farm List Sidebar */}
                <div className="hidden md:block w-64 p-4 overflow-y-auto border-r">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">
                      My Farms
                      <span className="text-sm text-gray-500 ml-2">
                        ({farmProfiles.length})
                      </span>
                    </h2>
                  </div>

                  {renderFarmList(farmProfiles)}
                </div>

                {/* Farm Details Section */}
                <div className="flex-1 p-2 overflow-y-auto">
                  {currentProfile ? (
                    <>
                      <Tabs defaultValue="farmInfo" className="w-full">
                        <TabsList className="w-full flex items-center justify-between gap-3 sticky top-0 left-0 right-0 py-2">
                          <TabsTrigger value="farmInfo">Farm Info</TabsTrigger>
                          <TabsTrigger value="farmerInfo">
                            Farmer Info
                          </TabsTrigger>
                          <TabsTrigger value="cooperative">
                            Cooperative
                          </TabsTrigger>
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditProfile}
                              title="Edit Farm Profile"
                            >
                              <Pencil size={16} />
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
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the farm
                                    profile for{" "}
                                    <strong>{currentProfile.farmName}</strong>.
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
                        >
                          <TabsContent value="farmInfo">
                            <FarmInformationDetails profile={currentProfile} />
                          </TabsContent>
                          <TabsContent value="farmerInfo">
                            <FarmerInformationDetails
                              profile={currentProfile}
                            />
                          </TabsContent>
                          <TabsContent value="cooperative">
                            <CooperativeDetails profile={currentProfile} />
                          </TabsContent>
                        </motion.div>
                      </Tabs>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Select a farm to view details
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Mobile Farm List Trigger */}
      <MobileFarmList />
      <Toaster />
    </motion.div>
  );
}
