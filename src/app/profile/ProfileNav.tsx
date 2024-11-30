"use client";
import React, { useRef } from "react";
import {
  User,
  Mail,
  MapPin,
  Link as LinkIcon,
  Trash2,
  Camera,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  deleteUserProfile,
  updateProfilePicture,
} from "@/store/userProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { toast } from "../../components/ui/use-toast";
import { ErrorState } from "../../components/ui/LoadingContent";
import { Button } from "../../components/ui/button";
import Logout from "../../components/ui/Logout";

export default function ProfileNav() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.userProfile
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  if (loading === "pending")
    return (
      <div className="text-center w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin w-28 h-28" />
      </div>
    );
  if (profile !== null && error) return <ErrorState error={error} />;
  if (!session)
    return (
      <div className="w-full h-full text-center p-4 flex flex-col items-center justify-center gap-2">
        <p>You are not logged in.</p>
        <Button variant="secondary">
          <Link href="/authclient/Login" className="text-primary-500">
            <>Sign In</>
          </Link>
        </Button>
      </div>
    );

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await dispatch(updateProfilePicture(file)).unwrap();
        toast({
          title: "Image Uploaded",
          description: "Your profile image has been successfully uploaded.",
          duration: 5000,
        });
        event.target.value = "";
      } catch (error: any) {
        toast({
          title: "Failed to upload image",
          description: error.message || "An error occurred",
          duration: 5000,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full flex flex-col overflow-y-auto border rounded-lg border-gray-300 dark:border-gray-600 capitalize">
      {/* Header Section with Cover & Avatar */}
      <div className="relative w-full group">
        <div className="h-24 md:h-32 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg" />
        <div className="absolute -bottom-10 md:-bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden relative">
            <Avatar className="h-full w-full border-2 border-primary-500 rounded-full shadow-lg">
              <AvatarImage
                src={
                  profile?.profilePicture || session?.user?.image || undefined
                }
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              onClick={handleProfilePictureClick}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="mt-12 p-4 space-y-4 flex-1">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-lg md:text-xl font-bold">
            {session?.user?.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            @{profile?.username}
          </p>
        </div>

        {/* Stats Card */}
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-base md:text-lg font-bold">0</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Listed
                </p>
              </div>
              <div>
                <p className="text-base md:text-lg font-bold">0</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Sold</p>
              </div>
              <div>
                <p className="text-base md:text-lg font-bold">0</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Wishlist
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{profile?.country}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{session?.user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <LinkIcon className="h-4 w-4 shrink-0" />
            <a href="#" className="text-blue-600 hover:underline truncate">
              portfolio.dev
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
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

        <div className="flex flex-col items-start justify-center gap-2">
          <small>
            {session?.user?.provider === "credentials"
              ? ""
              : "signed in with google"}
          </small>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => {
              dispatch(deleteUserProfile()).unwrap();
              toast({
                title: "Account Deleted",
                description: "Your account has been successfully deleted.",
                duration: 5000,
                variant: "destructive",
              });
              window.location.href = "/profile/ProfileForm";
            }}
          >
            <Trash2 size={18} className="mr-2" />
            Delete Profile
          </Button>
          <Logout />
        </div>
      </div>
    </div>
  );
}
