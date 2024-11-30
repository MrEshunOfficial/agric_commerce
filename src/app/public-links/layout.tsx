"use client";
import React from "react";
import { motion } from "framer-motion";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.main className="w-full h-full overflow-x-hidden overflow-y-auto relative border-none rounded-md">
      {children}
    </motion.main>
  );
};

export default Layout;
