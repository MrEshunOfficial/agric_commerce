"use client";
import React from "react";
import { Loader2, UserCircle2, Edit } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { profiles, loading } = useSelector(
    (state: RootState) => state.userProfile
  );
  const profile = profiles.find((profile) => profile.userId === userId);

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
      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-primary/10 to-primary/5">
        <Loader2 className="animate-spin text-primary w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-4">
      {/* Profile Header */}
      <div className="bg-primary/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-2 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {profile?.fullName}
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
      <div className="w-full flex flex-col gap-4">
        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Email", value: profile?.email },
              {
                label: "Phone",
                value: profile?.phoneNumber || "Not provided",
              },
            ].map((contact, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {contact.label}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                  {contact.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Identity Verification Section */}
        {profile?.identityCardType && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
              Identity Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  ID Type
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {profile.identityCardType}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  ID Number
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                  {profile.identityCardNumber}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bio Section */}
        {profile?.bio && (
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
              About Me
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Footer with Last Updated */}
        <div className="w-full bg-gray-50 dark:bg-gray-800 p-3 text-center text-xs text-gray-500 dark:text-gray-400 border-t rounded-b-2xl">
          Last Updated:{" "}
          {formatDate(session?.user?.updatedAt, "MMMM do, yyyy - p")}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
