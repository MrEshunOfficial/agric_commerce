"use client";
import React from "react";
import FarmList from "./public_access/FarmList";
import ProfileList from "./public_access/ProfileList";
import PostedFarms from "./product_listing/PostedFarms";
import SortedPosts from "./product_listing/SpecialComponent";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen flex flex-col xl:flex-row items-stretch justify-between rounded-md space-y-4 xl:space-y-0 xl:space-x-4 p-4">
      {/* Responsive Navigation Column */}
      <nav className="w-full xl:w-64 2xl:w-80 flex flex-col space-y-4">
        <div className="w-full h-auto border rounded-md shadow-sm">
          <ProfileList />
        </div>
        <div className="w-full flex-1 border rounded-md shadow-sm">
          <FarmList />
        </div>
      </nav>

      {/* Main Content Section */}
      <section className="w-full xl:flex-1 border rounded-md p-1 shadow-sm">
        <PostedFarms />
      </section>

      {/* Aside Column */}
      <aside className="w-full xl:w-64 2xl:w-80 border rounded-md shadow-sm">
        <SortedPosts />
      </aside>
    </main>
  );
}
