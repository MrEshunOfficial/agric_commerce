"use client";
import React from "react";
import { motion } from "framer-motion";
import UnifiedProfileFetch from "@/components/UnifiedProfileFetch";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UnifiedProfileFetch>
      <motion.main
        className="w-full h-[calc(80vh-4px)] sm:h-[calc(78vh-8px)] overflow-auto relative rounded-md"
        layout
      >
        {children}
      </motion.main>
    </UnifiedProfileFetch>
  );
};

export default Layout;
