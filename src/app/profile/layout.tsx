"use client";

import React from "react";
import { motion } from "framer-motion";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.main
      className="w-full h-[80vh] overflow-auto relative rounded-md"
      layout
    >
      {children}
    </motion.main>
  );
};

export default Layout;
