"use client";
import React from "react";

import ProfileDetails from "./ProfileDetails";
import { motion } from "framer-motion";

import { Toaster } from "@/components/ui/toaster";

const UserProfilePage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-100 dark:bg-gray-900 p-2"
    >
      <ProfileDetails />
      <Toaster />
    </motion.section>
  );
};

export default UserProfilePage;
