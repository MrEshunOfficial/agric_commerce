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
        await Promise.all([dispatch(fetchUserProfile())]);
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
      <div className="w-full h-[75vh] flex flex-col gap-4 items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 dark:from-gray-800 dark:to-black p-4">
        <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 shadow-lg flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-blue-200 dark:text-blue-500 w-12 h-12" />
          <span className="text-lg font-semibold text-white dark:text-gray-300 animate-pulse">
            Loading...
          </span>
        </div>
      </div>
    );
  }
  if (profile !== null && error) return <ErrorState error={error} />;

  return <>{children}</>;
};

export default UnifiedProfileFetch;
