import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  UserCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  UserIcon,
  LoaderCircle,
} from "lucide-react";

// Redux Types and Actions
import { AppDispatch, RootState } from "@/store";
import { fetchUserProfile, IUserProfile } from "@/store/userProfileSlice";
import { useSession } from "next-auth/react";

const ProfileListLoader: React.FC = () => (
  <div className="flex items-center justify-center w-full h-full p-4">
    <LoaderCircle size={18} className="animate-spin" />
  </div>
);

const ProfileListError: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center p-6 bg-red-50 dark:bg-red-950 rounded-lg">
    <div className="flex items-center space-x-3">
      <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
      <div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
          Error
        </h3>
        <p className="text-red-600 dark:text-red-400">{message}</p>
      </div>
    </div>
  </div>
);

const EmptyProfileList: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
    <UserCircle2 className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
    <p className="text-gray-600 dark:text-gray-400 text-center">
      No user profiles found
    </p>
  </div>
);

const ProfileHoverCard: React.FC<{
  profile: IUserProfile | null;
  isVisible: boolean;
  position: { top: number; left: number };
}> = ({ profile, isVisible, position }) => {
  if (!isVisible || !profile) return null;
  return (
    <div
      className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl rounded-lg border dark:border-gray-700 p-3 w-60 pointer-events-none transition-all duration-300 ease-in-out text-sm"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translate(-50%, 10px)",
        transition: "transform 500ms ease-in-out, opacity 300ms ease-in-out",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="w-full flex flex-col items-center space-x-4 mb-4">
        <Avatar className="w-full h-32 border-primary-500 rounded-md shadow-lg">
          <AvatarImage
            src={profile.profilePicture}
            alt={`${profile.fullName}'s profile`}
            className="object-cover"
          />
          <AvatarFallback>
            <User className="object-cover" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <UserIcon size={16} className="text-blue-500" />
          <span className="font-medium text-gray-800">{profile.fullName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-green-500" />
          <span className="text-gray-700">{profile.role}</span>
        </div>
        {profile.email && (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-red-500" />
            <span className="w-3/4 truncate text-gray-600">
              {profile.email}
            </span>
          </div>
        )}
        {profile.country && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-purple-500" />
            <span className="text-gray-700">{profile.country}</span>
          </div>
        )}
        {profile.phoneNumber && (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-indigo-500" />
            <span className="text-gray-700">{profile.phoneNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { profiles, loading, error } = useSelector(
    (state: RootState) => state.userProfile
  );

  useEffect(() => {
    dispatch(fetchUserProfile({}));
  }, [dispatch]);

  // Separate farmers and buyers
  const farmerProfiles = profiles.filter(
    (profile) => profile.role === "Farmer"
  );
  const buyerProfiles = profiles.filter((profile) => profile.role === "Buyer");

  const [hoveredProfile, setHoveredProfile] = useState<{
    profile: IUserProfile | null;
    position: { top: number; left: number };
  }>({
    profile: null,
    position: { top: 0, left: 0 },
  });

  const handleMouseEnter = (event: React.MouseEvent, profile: IUserProfile) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const groupRect = event.currentTarget
      .closest("[data-profile-group]")
      ?.getBoundingClientRect();

    if (groupRect) {
      setHoveredProfile({
        profile,
        position: {
          top: groupRect.bottom + window.scrollY,
          left: groupRect.left + groupRect.width / 2 + window.scrollX,
        },
      });
    } else {
      setHoveredProfile({
        profile,
        position: {
          top: rect.bottom + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX,
        },
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredProfile({
      profile: null,
      position: { top: 0, left: 0 },
    });
  };

  const renderProfileGroup = (title: string, profiles: IUserProfile[]) => (
    <div
      className="p-2 w-full border rounded-md mb-2"
      data-profile-group={title}
    >
      <div className="flex items-center justify-start gap-2 mb-2">
        {profiles.length}
        <span className="text-sm">{title}</span>
      </div>
      <div className="flex flex-wrap justify-start items-center border rounded-md p-2">
        {profiles.map((profile, index) => (
          <Link
            key={profile._id}
            href={
              profile.email !== session?.user?.email
                ? `/public_access/public_profile/${profile.userId}`
                : "/profile/shared_profile"
            }
            className="block relative"
            onMouseEnter={(e) => handleMouseEnter(e, profile)}
            onMouseLeave={handleMouseLeave}
          >
            <Avatar
              className={`w-11 h-11 border-2 border-gray-500 rounded-full shadow-lg -mx-2 ${
                index === 0 ? "" : "z-10"
              }`}
            >
              <AvatarImage
                src={
                  profile.profilePicture ||
                  "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                alt={`${profile.fullName}'s profile`}
                className="rounded-full object-cover"
              />
              <AvatarFallback>
                <User className="h-11 w-11 text-gray-500 dark:text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </Link>
        ))}
      </div>
    </div>
  );

  if (loading === "pending") return <ProfileListLoader />;
  if (error) return <ProfileListError message={error} />;
  if (!profiles || profiles.length === 0) return <EmptyProfileList />;

  return (
    <>
      {/* Farmers Section */}
      {renderProfileGroup("Registered Farmers", farmerProfiles)}

      {/* Buyers Section */}
      {renderProfileGroup("Available Buyers", buyerProfiles)}

      {/* Hover Card */}
      <ProfileHoverCard
        profile={hoveredProfile.profile}
        isVisible={!!hoveredProfile.profile}
        position={hoveredProfile.position}
      />
    </>
  );
};

export default ProfileList;
