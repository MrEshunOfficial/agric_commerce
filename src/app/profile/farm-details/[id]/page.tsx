"use client";
import React from "react";
import {
  Loader2,
  User,
  AtSign,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Shield,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

const ProfilePage: React.FC = () => {
  const params = useParams();
  const profileId = params.id as string;
  const userId = profileId;

  const { profiles, loading } = useSelector(
    (state: RootState) => state.userProfile
  );
  const profile = profiles.find((profile) => profile.userId === userId);

  // Loading State
  if (loading === "pending") {
    return (
      <div className="flex items-center justify-center h-[80vh] w-full">
        <Loader2 className="animate-spin mr-2 text-primary" size={18} />
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  // No Profile State
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin mr-2 text-primary" size={18} />
        <span className="text-gray-600">Initializing...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[71vh] lg:col-span-3 space-y-4 gap-2">
      {/* Personal Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
          <User className="mr-2 text-primary" size={18} />
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              label: "Full Name",
              value: profile.fullName,
              icon: <User className="mr-2 text-blue-500" size={18} />,
            },
            {
              label: "Username",
              value: profile.username,
              icon: <AtSign className="mr-2 text-green-500" size={18} />,
            },
            {
              label: "Role",
              value: profile.role,
              link: "/profile/farm-details",
              icon: <Briefcase className="mr-2 text-purple-500" size={18} />,
            },
          ].map((detail, index) => (
            <div key={index} className="flex items-center">
              {detail.icon}
              <div>
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
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
          <Mail className="mr-2 text-primary" size={18} />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              label: "Email",
              value: profile.email,
              icon: <Mail className="mr-2 text-red-500" size={18} />,
            },
            {
              label: "Phone",
              value: profile.phoneNumber || "Not provided",
              icon: <Phone className="mr-2 text-teal-500" size={18} />,
            },
          ].map((contact, index) => (
            <div key={index} className="flex items-center">
              {contact.icon}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {contact.label}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {contact.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
            <MapPin className="mr-2 text-primary" size={18} />
            Location
          </h2>
          <div className="flex items-center">
            <MapPin className="mr-2 text-orange-500" size={18} />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {profile.country || "Not specified"}
            </p>
          </div>
        </div>

        {/* Identity Verification */}
        {profile.identityCardType && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
              <Shield className="mr-2 text-primary" size={18} />
              Identity Verification
            </h2>
            <div>
              <div className="flex items-center mb-2">
                <Shield className="mr-2 text-indigo-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    ID Type
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {profile.identityCardType}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="mr-2 text-pink-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    ID Number
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {profile.identityCardNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
            <FileText className="mr-2 text-primary" size={18} />
            About Me
          </h2>
          <div className="flex items-start">
            <FileText className="mr-2 text-gray-500 mt-1" size={18} />
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              {profile.bio}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
