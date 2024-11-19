"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import UnifiedProfileFetch from "@/components/UnifiedProfileFetch";
import ProfileNav from "@/app/profile/ProfileNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <UnifiedProfileFetch>
      <div className="w-full min-h-[calc(78vh-168px)] sm:min-h-[calc(78vh-80px)] relative">
        {/* Mobile Nav Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setIsNavVisible(!isNavVisible)}
          >
            {isNavVisible ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isNavVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsNavVisible(false)}
            />
          )}
        </AnimatePresence>

        {/* Navigation Sidebar */}
        <div className="flex flex-col md:flex-row gap-4 p-1">
          <AnimatePresence>
            {(isNavVisible || window.innerWidth >= 768) && (
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", bounce: 0.2 }}
                className={`
                  fixed md:relative
                  top-0 left-0
                  h-full md:h-auto
                  w-3/4 md:w-auto
                  bg-background
                  z-50 md:z-auto
                  p-4 md:p-0
                  overflow-y-auto
                  flex-shrink-0
                  ${isNavVisible ? "block" : "hidden md:block"}
                `}
              >
                <ProfileNav />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <motion.main
            className="w-full flex-1 min-h-0 overflow-auto rounded-lg shadow-sm border"
            layout
          >
            {children}
          </motion.main>
        </div>
      </div>
    </UnifiedProfileFetch>
  );
};

export default Layout;
