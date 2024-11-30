"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchUserProfile } from "@/store/userProfileSlice";
import { useSession } from "next-auth/react";
import { toast } from "./ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ErrorState } from "@/components/ui/LoadingContent";
import { Loader2 } from "lucide-react";
import { fetchFarmProfiles } from "@/store/farmSlice";
// import { fetchFarmProfiles } from "@/store/farmSlice";

interface UnifiedFetchProps {
  children: React.ReactNode;
}

const UnifiedProfileFetch: React.FC<UnifiedFetchProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { profile, error, loading } = useSelector(
    (state: RootState) => state.userProfile
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUserProfile()),
          dispatch(fetchFarmProfiles()),
        ]);
      } catch (err) {
        toast({
          title: "System Error",
          description:
            "An error occurred while fetching data. Please try again later.",
          duration: 7000,
          variant: "destructive",
        });
      }
    };

    if (userId) {
      fetchData();
    }
  }, [dispatch, userId]);

  if (loading === "pending") {
    return (
      <div className="w-full h-[75vh] flex gap-4 items-center justify-center p-4">
        <Loader2 className="animate-spin" size={20} />
        <span className="text-lg font-semibold animate-pulse">Loading...</span>
      </div>
    );
  }
  if (profile !== null && error) return <ErrorState error={error} />;

  return <>{children}</>;
};

export default UnifiedProfileFetch;
