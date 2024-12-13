"use client";
import React, { useEffect, useState } from "react";
import { UserCircle2, Mail, MapPin, User, Tag, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { fetchUserProfile, IUserProfile } from "@/store/userProfileSlice";
import { useParams } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

import { fetchFarmProfiles } from "@/store/farmSlice";
import { FarmProfileData } from "@/store/type/formtypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReviewAndRatings } from "@/app/product_listing/ReviewAndRatings";
import { AddRatingReview } from "@/app/product_listing/ReviewsAndRatings";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const params = useParams();
  const profileId = params.id as string;
  const userId = profileId;
  const { profiles } = useSelector((state: RootState) => state.userProfile);

  useEffect(() => {
    dispatch(fetchUserProfile({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFarmProfiles({}));
  }, [dispatch]);

  const profile = profiles.find(
    (profile: IUserProfile) => profile.userId === userId
  );

  const { farmProfiles } = useSelector(
    (state: RootState) => state.farmProfiles
  );

  const filteredFarms = farmProfiles.filter(
    (farm: FarmProfileData) => farm.userId === userId
  );

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        initializing <span className="animate-bounce">...</span>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row items-stretch gap-4 p-4">
      <MobileNavigation profile={profile} filteredFarms={filteredFarms} />
      <DesktopNavigation profile={profile} filteredFarms={filteredFarms} />

      <section className="flex-1 w-full lg:w-auto border rounded-md p-4 order-2 lg:order-1">
        {children}
      </section>

      <aside className="w-full lg:w-80 h-auto lg:h-full order-3 lg:order-2">
        {profile.ratings?.length !== 0 ? (
          <ReviewAndRatings profile={profile} />
        ) : (
          <AddRatingReview profile={profile} />
        )}
      </aside>

      <Toaster />
    </main>
  );
};

interface DynamicNavProps {
  profile: IUserProfile;
  filteredFarms: FarmProfileData[];
}

const DesktopNavigation: React.FC<DynamicNavProps> = ({
  profile,
  filteredFarms,
}) => {
  return (
    <div className="hidden lg:block w-80 h-full order-1">
      <div className="h-full flex flex-col overflow-y-auto border rounded-md capitalize">
        {/* Header Section with Cover & Avatar */}
        <Link
          href={`/public_access/public_profile/${profile.userId}`}
          className="w-full relative group"
        >
          <Avatar className="h-40 w-full border-primary-500 rounded-md relative">
            <AvatarImage
              src={
                profile?.profilePicture ||
                "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              alt={profile?.username}
              className="object-cover"
            />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>

            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 rounded-b-md w-full">
              <h1 className="text-lg md:text-xl font-bold">
                {profile?.fullName}
              </h1>
              <p className="text-sm flex items-center gap-2 capitalize">
                <Tag size={16} /> {profile.username} • {profile.role}
              </p>
            </div>
          </Avatar>
        </Link>

        {/* Profile Info Section */}
        <div className="p-2 space-y-2 flex-1">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 shrink-0" /> Location:{" "}
              <span className="truncate">{profile?.country}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 my-4">
            {profile?.socialMediaLinks?.facebook && (
              <Link
                href={profile.socialMediaLinks.facebook}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
              >
                <FaFacebook className="h-5 w-5" />
              </Link>
            )}
            {profile?.socialMediaLinks?.twitter && (
              <Link
                href={profile.socialMediaLinks.twitter}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
            )}
            {profile?.socialMediaLinks?.linkedIn && (
              <Link
                href={profile.socialMediaLinks.linkedIn}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
              >
                <FaLinkedinIn className="h-5 w-5" />
              </Link>
            )}
            {profile?.socialMediaLinks?.instagram && (
              <Link
                href={profile.socialMediaLinks.instagram}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
              >
                <FaInstagram className="h-5 w-5" />
              </Link>
            )}
          </div>

          {profile.role === "Farmer" ? (
            <DynamicFarmer filteredFarms={filteredFarms} />
          ) : (
            <DynamicBuyer />
          )}
        </div>
      </div>
    </div>
  );
};

const MobileNavigation: React.FC<DynamicNavProps> = ({
  profile,
  filteredFarms,
}) => {
  return (
    <div className="block lg:hidden w-full order-1">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full mb-4">
            <Menu className="mr-2 h-4 w-4" /> View Profile Details
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] md:w-[400px]">
          <div className="h-full flex flex-col overflow-y-auto capitalize">
            {/* Header Section with Cover & Avatar */}
            <Link
              href={`/public_access/public_profile/${profile.userId}`}
              className="w-full relative group"
            >
              <Avatar className="h-40 w-full border-primary-500 rounded-md relative">
                <AvatarImage
                  src={
                    profile?.profilePicture ||
                    "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
                  }
                  alt={profile?.username}
                  className="object-cover"
                />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>

                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 rounded-b-md w-full">
                  <h1 className="text-lg font-bold">{profile?.fullName}</h1>
                  <p className="text-sm flex items-center gap-2 capitalize">
                    <Tag size={16} /> {profile.username} • {profile.role}
                  </p>
                </div>
              </Avatar>
            </Link>

            {/* Profile Info Section */}
            <div className="p-2 space-y-2 flex-1">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 shrink-0" /> Location:{" "}
                  <span className="truncate">{profile?.country}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 my-4">
                {profile?.socialMediaLinks?.facebook && (
                  <Link
                    href={profile.socialMediaLinks.facebook}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    <FaFacebook className="h-5 w-5" />
                  </Link>
                )}
                {profile?.socialMediaLinks?.twitter && (
                  <Link
                    href={profile.socialMediaLinks.twitter}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    <FaTwitter className="h-5 w-5" />
                  </Link>
                )}
                {profile?.socialMediaLinks?.linkedIn && (
                  <Link
                    href={profile.socialMediaLinks.linkedIn}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    <FaLinkedinIn className="h-5 w-5" />
                  </Link>
                )}
                {profile?.socialMediaLinks?.instagram && (
                  <Link
                    href={profile.socialMediaLinks.instagram}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </Link>
                )}
              </div>

              {profile.role === "Farmer" ? (
                <DynamicFarmer filteredFarms={filteredFarms} />
              ) : (
                <DynamicBuyer />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface DynamicPageProps {
  filteredFarms: FarmProfileData[];
}

const DynamicFarmer: React.FC<DynamicPageProps> = ({ filteredFarms }) => {
  return (
    <div className="w-full">
      {filteredFarms.length > 0 && (
        <small className="text-start">
          Registered farms: {filteredFarms.length}
        </small>
      )}
      <ScrollArea className="h-[400px] w-full my-2 p-2 rounded-md">
        <div className="w-full flex flex-col gap-3">
          {filteredFarms.map((farm: FarmProfileData) => (
            <Link
              href={`/public_access/public_profile/${farm.userId}/${farm._id}`}
              key={farm._id}
              className="border rounded-lg p-2 shadow-md hover:bg-background transition-shadow"
            >
              <div className="mb-2">
                <div className="hover:text-blue-600">
                  <h3 className="font-semibold">{farm.farmName}</h3>
                  <small>Location: {farm.farmLocation}</small>
                </div>
              </div>
              <div className="mt-3 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-xs">Scale: {farm.productionScale}</span>
                  <span className="text-xs">Size: {farm.farmSize} acres</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const DynamicBuyer: React.FC = () => {
  return (
    <div className="w-full">
      <small className="text-start">Recent Purchases</small>
      <ScrollArea className="h-[400px] w-full my-2 p-2 rounded-md">
        <div className="w-full flex flex-col gap-3 text-[14px]">
          No item purchased yet
        </div>
      </ScrollArea>
    </div>
  );
};

export default Layout;
