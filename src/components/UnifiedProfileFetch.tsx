"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchUserProfile } from "@/store/userProfileSlice";
import { useSession } from "next-auth/react";
import { toast } from "./ui/use-toast";

interface UnifiedFetchProps {
  children: React.ReactNode;
}

const UnifiedProfileFetch: React.FC<UnifiedFetchProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

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

  return <>{children}</>;
};

export default UnifiedProfileFetch;
