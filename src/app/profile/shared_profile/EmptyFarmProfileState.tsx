import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TractorIcon } from "lucide-react";
import FarmProfileForm from "./farm.profile.form/page";

const EmptyFarmProfileState = () => {
  return (
    <motion.div
      className="w-full min-h-[400px] flex items-center justify-center p-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <Card
        className="w-full shadow-xl border 
        bg-white dark:bg-neutral-900 
        border-gray-100 dark:border-neutral-800
        hover:shadow-2xl transition-shadow duration-300"
      >
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div
              className="bg-blue-100 dark:bg-blue-900/30 
              rounded-full p-4 inline-block"
            >
              <TractorIcon
                className="text-blue-600 dark:text-blue-400 
                opacity-80"
                size={48}
                strokeWidth={1.5}
              />
            </div>
          </div>
          <CardTitle
            className="text-2xl font-bold 
            text-gray-800 dark:text-gray-100"
          >
            No Farm Profiles Yet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <p
            className="text-gray-600 dark:text-gray-300 
            text-sm leading-relaxed"
          >
            {` Start your agricultural journey by creating your first farm profile.
            Organize, track, and manage your farm's details with ease.`}
          </p>

          <div className="w-full flex justify-center">
            <p className="group flex items-center p-2 border rounded-md">
              Create First Profile
            </p>
          </div>

          {/* Optional: Inline Farm Profile Form */}
          <FarmProfileForm />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmptyFarmProfileState;
