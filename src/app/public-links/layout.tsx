"use client";
import React from "react";
import { motion } from "framer-motion";
import ContactNav from "./ContactNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-[78vh] flex items-center justify-center gap-2 relative">
      <ContactNav />
      <motion.main className="flex-1 h-full overflow-x-hidden overflow-y-auto relative border">
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
