"use client";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Mail, MapPin, User, Tag, UserCircle2, Verified } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { fetchUserProfile, IUserProfile } from "@/store/userProfileSlice";
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
import { useSession } from "next-auth/react";

import { fetchPostedAds } from "@/store/postSlice";
import { PostData } from "@/store/type/post.types";
import { ReviewAndRatings } from "@/app/product_listing/ReviewAndRatings";
import { AddRatingReview } from "@/app/product_listing/ReviewsAndRatings";
import { CustomerDashboard } from "./CustomerDashboard";
import { DynamicPage } from "./DynamicPage";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { farmProfiles } = useSelector(
    (state: RootState) => state.farmProfiles
  );
  const { profiles } = useSelector((state: RootState) => state.userProfile);
  const { posts } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchUserProfile({}));
    dispatch(fetchFarmProfiles({}));
    dispatch(fetchPostedAds({}));
  }, [dispatch]);

  const profile = profiles.find(
    (profile: IUserProfile) => profile.userId === userId
  );

  const filteredFarms = farmProfiles.filter(
    (farm: FarmProfileData) => farm.userId === userId
  );

  const userPosts = posts.filter((post) => post.userId === userId);
  const wishList = userPosts.filter((post) => post.wishlist === true).length;
  const statusPosts = userPosts.filter(
    (post) => post.product.status === false
  ).length;

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // No Profile State
  if (!profile || profile === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <UserCircle2 className="w-20 h-20 text-primary/50" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Complete Your Profile
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enhance your experience by setting up a comprehensive profile
              </p>
            </div>
            <Button
              asChild
              className="w-full py-2 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-colors"
            >
              <Link href="/profile/ProfileForm">Create Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row items-stretch gap-2 p-2">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden w-full flex justify-end mb-2">
        <Button onClick={toggleMobileMenu} variant="outline" className="z-50">
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar Navigation - Mobile and Desktop */}
      <div
        className={`
        fixed inset-0 z-40 lg:static lg:block 
        w-full lg:w-80 h-full 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 
        bg-white dark:bg-gray-900 
        overflow-y-auto
      `}
      >
        <div className="h-full flex flex-col overflow-y-auto border rounded-md capitalize">
          <DynamicNav
            profile={profile}
            filteredFarms={filteredFarms}
            userPosts={userPosts}
            wishList={wishList}
            statusPosts={statusPosts}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <section className="flex-1 min-h-[500px] border rounded-md flex items-center p-2">
        {children}
      </section>

      {/* Reviews Section - Responsive */}
      <aside className="w-full lg:w-80 h-full flex flex-col overflow-y-auto border rounded-md capitalize">
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
  userPosts: PostData[];
  wishList: any;
  statusPosts: any;
  onClose?: () => void;
}

const DynamicNav: React.FC<DynamicNavProps> = ({
  profile,
  filteredFarms,
  userPosts,
  wishList,
  statusPosts,
  onClose,
}) => {
  return (
    <>
      <div className="w-full flex-1 flex-col gap-1">
        {/* Header Section with Cover & Avatar */}
        <Link
          href={`/profile/shared_profile`}
          className="w-full relative group"
          onClick={onClose}
        >
          {/* Avatar with Image as Background */}
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

            {/* Username and Role */}
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 rounded-b-md w-full">
              <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
                {profile?.fullName}{" "}
                {profile?.verified ? (
                  <Verified size={18} />
                ) : (
                  <small className="text-xs">(Pending verification)</small>
                )}
              </h1>
              <p className="text-sm flex items-center gap-2 capitalize">
                <Tag size={16} /> {profile.username} • {profile.role}
              </p>
            </div>
          </Avatar>
        </Link>

        {/* Profile Info Section */}
        <div className="p-2 space-y-2 flex-1 ">
          {/* Stats Card */}
          <Card className="w-full p-0 flex flex-col gap-2">
            <CardContent className="w-full p-2">
              <Link
                href={"/profile/shared_profile/farmer_dashboard"}
                className="grid grid-cols-3 gap-2 text-center"
                onClick={onClose}
              >
                <div>
                  <p className="text-base md:text-lg font-bold">
                    {userPosts.length}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Posts
                  </p>
                </div>
                <div>
                  <p className="text-base md:text-lg font-bold">
                    {statusPosts}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Sold
                  </p>
                </div>
                <div>
                  <p className="text-base md:text-lg font-bold">{wishList}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Wishlist
                  </p>
                </div>
              </Link>
            </CardContent>
            <CardContent className="w-full flex items-center justify-center p-2">
              <Button className="w-full" variant={"link"}>
                <Link
                  href={"/profile/FarmProfileForm"}
                  className="w-full"
                  onClick={onClose}
                >
                  Add Farm Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Info Grid */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 shrink-0" /> Location:{" "}
              <span className="truncate">{profile?.country}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{profile?.email}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="w-full flex justify-center gap-4 mt-2">
            {profile?.socialMediaLinks?.facebook && (
              <Link
                href={profile.socialMediaLinks.facebook}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                onClick={onClose}
              >
                <FaFacebook className="h-5 w-5" />
              </Link>
            )}
            {profile?.socialMediaLinks?.twitter && (
              <Link
                href={profile.socialMediaLinks.twitter}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                onClick={onClose}
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
            )}
            {profile?.socialMediaLinks?.linkedIn && (
              <Link
                href={profile.socialMediaLinks.linkedIn}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                onClick={onClose}
              >
                <FaLinkedinIn className="h-5 w-5" />
              </Link>
            )}
            {profile?.socialMediaLinks?.instagram && (
              <Link
                href={profile.socialMediaLinks.instagram}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                onClick={onClose}
              >
                <FaInstagram className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex-1 p-2">
        {profile.role === "Farmer" ? (
          <DynamicPage filteredFarms={filteredFarms} />
        ) : (
          <CustomerDashboard />
        )}
      </div>
    </>
  );
};

export default Layout;
