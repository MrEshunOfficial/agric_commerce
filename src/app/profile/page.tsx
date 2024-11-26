"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  User,
  Mail,
  MapPin,
  BadgeCheck,
  Loader2,
  UserCircle2,
  Briefcase,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Utility Components
interface ProfileIconProps {
  icon: React.ElementType;
  className?: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  icon: Icon,
  className = "",
}) => (
  <div className="p-2.5 bg-primary/10 rounded-lg">
    <Icon className={`w-5 h-5 text-primary ${className}`} />
  </div>
);

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
    <ProfileIcon icon={Icon} />
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
      {title}
    </h3>
  </div>
);

interface ProfileFieldProps {
  label: string;
  value?: string | number;
  icon?: React.ElementType;
  isLink?: boolean;
  href?: string; // Make href optional
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  icon: Icon = undefined,
  isLink = false,
  href,
}) => {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-center space-x-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      {Icon && <ProfileIcon icon={Icon} className="w-4 h-4" />}
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
          {label}
        </p>
        {isLink && href ? (
          <Link
            href={href}
            className="text-primary hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </Link>
        ) : (
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
            {value}
          </p>
        )}
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const { profile, loading } = useSelector(
    (state: RootState) => state.userProfile
  );

  // Loading State
  if (loading === "pending") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary w-16 h-16" />
      </div>
    );
  }

  // No Profile State
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[75vh] p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center mb-4">
              <UserCircle2 className="w-24 h-24 text-gray-300 dark:text-gray-600" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Complete Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enhance your experience by setting up a comprehensive profile
              </p>
            </div>
            <Button
              asChild
              className="w-full py-3 rounded-xl text-base font-semibold"
            >
              <Link href="/profile/ProfileForm">Create Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Date Formatting Utility
  const formatDate = (date: Date | string | undefined, formatStr: string) => {
    try {
      return date ? format(new Date(date), formatStr) : "N/A";
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <Card className="w-full h-[75vh] overflow-auto shadow-2xl rounded-xl border-none p-3">
      <CardHeader className="bg-primary/5 py-6 px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {profile.fullName}
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Joined {formatDate(session?.user?.createdAt, "MMMM yyyy")}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid md:grid-cols-2 gap-4 p-4 border-none">
        {/* Personal Information */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <SectionHeader icon={User} title="Personal Details" />
            <ProfileField
              label="Full Name"
              value={profile.fullName}
              icon={User}
            />
            <ProfileField label="Username" value={profile.username} />
            <ProfileField
              label="Role"
              value={profile.role}
              icon={Briefcase}
              isLink={true}
              href="/profile/farm-details"
            />
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <SectionHeader icon={Mail} title="Contact Information" />
            <ProfileField label="Email" value={profile.email} icon={Mail} />
            <ProfileField
              label="Phone"
              value={profile.phoneNumber}
              icon={User}
            />
          </div>
        </div>

        {/* Secondary Information */}
        <div className="space-y-6">
          {/* Location */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <SectionHeader icon={MapPin} title="Location" />
            <ProfileField
              label="Country"
              value={profile.country}
              icon={MapPin}
            />
          </div>

          {/* Identity Verification */}
          {profile.identityCardType && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
              <SectionHeader icon={BadgeCheck} title="Identity Verification" />
              <ProfileField
                label="ID Type"
                value={profile.identityCardType}
                icon={BadgeCheck}
              />
              <ProfileField
                label="ID Number"
                value={profile.identityCardNumber}
              />
            </div>
          )}

          {/* Bio Section */}
          {profile.bio && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
              <SectionHeader icon={Info} title="About Me" />
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer with Last Updated */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Last Updated:{" "}
        {formatDate(session?.user?.updatedAt, "MMMM do, yyyy - p")}
      </div>
    </Card>
  );
};

export default ProfilePage;
