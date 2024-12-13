"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CustomerDashboard = () => {
  // Placeholder for customer dashboard content
  return (
    <div className="w-full">
      <Button variant={"link"}>
        <Link href={"/profile/shared_profile/buyer_dashboard"}>
          Open dashboard
        </Link>
      </Button>
    </div>
  );
};
