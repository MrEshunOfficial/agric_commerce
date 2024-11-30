"use client";
import React, { useState } from "react";
import { Loader2, UserCircle2, Edit, Menu } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import ProfileNav from "./ProfileNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ProfilePage: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { data: session } = useSession();
  const { profile, loading } = useSelector(
    (state: RootState) => state.userProfile
  );

  // Date Formatting Utility
  const formatDate = (date: Date | string | undefined, formatStr: string) => {
    try {
      return date ? format(new Date(date), formatStr) : "N/A";
    } catch {
      return "Invalid Date";
    }
  };

  // Loading State
  if (loading === "pending") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-primary/5">
        <Loader2 className="animate-spin text-primary w-16 h-16" />
      </div>
    );
  }

  // No Profile State
  if (!profile) {
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
    <div className="container mx-auto px-2 py-4 space-y-4">
      {/* Profile Header */}
      <div className="bg-primary/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-2 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {profile.fullName}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Joined {formatDate(session?.user?.createdAt, "MMMM yyyy")}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full md:w-auto border-primary text-primary hover:bg-primary/10 flex items-center justify-center text-sm"
        >
          <Edit className="mr-2 w-4 h-4" />
          <Link href="/profile/ProfileForm">Edit Profile</Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Mobile Navigation Trigger */}
        <div className="lg:hidden mb-2">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Menu className="mr-2 h-4 w-4" /> Profile Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="mt-6">
                <ProfileNav />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3">
            <ProfileNav />
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Full Name", value: profile.fullName },
                { label: "Username", value: profile.username },
                {
                  label: "Role",
                  value: profile.role,
                  link: "/profile/farm-details",
                },
              ].map((detail, index) => (
                <div key={index}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {detail.label}
                  </p>
                  {detail.link ? (
                    <Link
                      href={detail.link}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {detail.value}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {detail.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Email", value: profile.email },
                {
                  label: "Phone",
                  value: profile.phoneNumber || "Not provided",
                },
              ].map((contact, index) => (
                <div key={index}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {contact.label}
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {contact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
                Location
              </h2>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {profile.country || "Not specified"}
              </p>
            </div>

            {/* Identity Verification */}
            {profile.identityCardType && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Identity Verification
                </h2>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    ID Type
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {profile.identityCardType}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    ID Number
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {profile.identityCardNumber}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
                About Me
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Last Updated */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 text-center text-xs text-gray-500 dark:text-gray-400 border-t rounded-b-2xl">
        Last Updated:{" "}
        {formatDate(session?.user?.updatedAt, "MMMM do, yyyy - p")}
      </div>
    </div>
  );
};

export default ProfilePage;
