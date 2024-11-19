import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Globe,
  MapPin,
  User,
  BadgeCheck,
  ShoppingCart,
  Leaf,
  Calendar,
  Clock,
  Loader2,
  UserCircle2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  ErrorState,
  LoadingPageSkeleton,
} from "@/components/ui/LoadingContent";
import { Button } from "@/components/ui/button";

interface ProfileSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

interface ProfileFieldProps {
  label: string;
  value?: string | number;
  isLink?: boolean;
}

interface TagProps {
  text: string;
  variant: "green" | "blue";
}

// Components remain the same
const Tag: React.FC<TagProps> = ({ text, variant }) => (
  <span
    className={`px-2 py-1 text-sm rounded-full ${
      variant === "green"
        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
        : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
    }`}
  >
    {text}
  </span>
);

const ProfileSection: React.FC<ProfileSectionProps> = ({
  icon,
  title,
  children,
  className = "",
}) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ${className}`}
  >
    <div className="flex items-center space-x-2 mb-4">
      <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  isLink,
}) => {
  if (!value && value !== 0) return null;

  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      {isLink ? (
        <Link
          href={value.toString()}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </Link>
      ) : (
        <span className="text-gray-700 dark:text-gray-300">{value}</span>
      )}
    </div>
  );
};

const ProfileDetails = () => {
  const { data: session } = useSession();
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.userProfile
  );

  if (loading === "pending") {
    return <LoadingPageSkeleton />;
  } else if (profile === null) {
    return session ? (
      <div className="w-full h-[77vh] flex items-center justify-center p-2">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
              <UserCircle2 className="w-16 h-16 text-gray-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Complete Your Profile
              </h3>
              <p className="text-gray-600">
                Take a moment to set up your profile to get the most out of our
                platform
              </p>
            </div>

            <Button variant="default" className="w-full max-w-xs" asChild>
              <Link href="/profile/ProfileForm">
                <span className="flex items-center justify-center gap-2">
                  Create Profile
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    ) : (
      <div className="w-full h-[77vh] flex items-center justify-center p-2">
        please login first
      </div>
    );
  } else if (profile !== null && error) {
    return <ErrorState error={error} />;
  }

  // Helper function to safely format dates
  const formatDate = (date: string | Date | undefined, formatStr: string) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), formatStr);
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Card
      className="w-full mx-auto bg-gradient-to-br from-gray-50 to-white 
                    dark:from-gray-900 dark:to-gray-800 shadow-lg rounded-xl 
                    overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-2xl">{`${profile?.fullName}'s Profile`}</CardTitle>
      </CardHeader>

      <CardContent className="p-3 min-h-[calc(75vh-168px)] overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Info Section */}
          <div className="space-y-6">
            <ProfileSection
              icon={<User className="w-5 h-5" />}
              title="Personal Info"
            >
              <ProfileField label="Full Name" value={profile?.fullName} />
              <ProfileField label="Username" value={profile?.username} />
              <ProfileField label="Gender" value={profile?.gender} />
              <ProfileField label="Registered as a" value={profile?.role} />
            </ProfileSection>

            <ProfileSection icon={<Mail className="w-5 h-5" />} title="Contact">
              <ProfileField label="Email" value={profile?.email} />
              <ProfileField label="Phone" value={profile?.phoneNumber} />
            </ProfileSection>

            <ProfileSection
              icon={<MapPin className="w-5 h-5" />}
              title="Location"
            >
              <ProfileField label="Country" value={profile?.country} />
            </ProfileSection>
          </div>

          {/* Secondary Info Section */}
          <div className="space-y-6">
            {profile?.identityCardType && (
              <ProfileSection
                icon={<BadgeCheck className="w-5 h-5" />}
                title="Identity Verification"
              >
                <ProfileField
                  label="ID Type"
                  value={profile?.identityCardType}
                />
                <ProfileField
                  label="ID Number"
                  value={profile?.identityCardNumber}
                />
              </ProfileSection>
            )}

            {profile?.isFarmer && profile?.farmDetails && (
              <ProfileSection
                icon={<Leaf className="w-5 h-5" />}
                title="Farm Details"
              >
                <ProfileField
                  label="Farm Name"
                  value={profile?.farmDetails.farmName}
                />
                <ProfileField
                  label="Location"
                  value={profile?.farmDetails.location}
                />
                <ProfileField
                  label="Size"
                  value={`${profile?.farmDetails.sizeInAcres} acres`}
                />

                {profile?.farmDetails?.cropsGrown &&
                  profile.farmDetails.cropsGrown.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Crops Grown
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profile.farmDetails.cropsGrown.map((crop, index) => (
                          <Tag key={index} text={crop} variant="green" />
                        ))}
                      </div>
                    </div>
                  )}

                {profile.farmDetails.livestock &&
                  profile.farmDetails.livestock.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Livestock
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profile.farmDetails.livestock.map((animal, index) => (
                          <Tag key={index} text={animal} variant="blue" />
                        ))}
                      </div>
                    </div>
                  )}
              </ProfileSection>
            )}
          </div>
        </div>

        {/* Purchase History Section */}
        {profile?.isBuyer &&
          profile?.purchaseHistory &&
          profile?.purchaseHistory.length > 0 && (
            <div className="mt-6">
              <ProfileSection
                icon={<ShoppingCart className="w-5 h-5" />}
                title="Recent Purchases"
              >
                <div className="grid gap-3">
                  {profile?.purchaseHistory
                    .slice(0, 3)
                    .map((purchase, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg 
                             hover:bg-gray-100 dark:hover:bg-gray-700 
                             transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            Product: {purchase.productId}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(purchase.purchaseDate, "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>Quantity: {purchase.quantity}</span>
                          <span className="font-medium">${purchase.price}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </ProfileSection>
            </div>
          )}

        {/* About Section */}
        {profile?.bio && (
          <div className="mt-6">
            <ProfileSection
              icon={<User className="w-5 h-5" />}
              title="About Me"
            >
              <p className="text-gray-600 dark:text-gray-400">{profile?.bio}</p>
            </ProfileSection>
          </div>
        )}

        {/* Footer Information */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>
              Member since:{" "}
              {formatDate(session?.user?.createdAt, "MMMM do yyyy")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              Last updated: {formatDate(session?.user?.updatedAt, "PPpp")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
