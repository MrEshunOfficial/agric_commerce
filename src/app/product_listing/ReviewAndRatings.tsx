"use client";
import { IUserProfile } from "@/store/userProfileSlice";
import React from "react";
import { FaStar } from "react-icons/fa";
import { AddRatingReview } from "./ReviewsAndRatings";

export const ReviewAndRatings: React.FC<{ profile: IUserProfile }> = ({
  profile,
}) => {
  return (
    <div className="w-80 h-full flex flex-col items-start justify-between">
      <div className="w-full flex-1 flex flex-col items-end gap-2 bg-gray-100 dark:bg-gray-900/50 rounded-md p-2">
        <h2 className="text-center w-full my-1 flex items-center justify-center">
          Customer Feedback
        </h2>
        {profile.ratings?.map((rate, i) => {
          const stars = Array.from(
            { length: rate.farmer_rating },
            (_, index) => (
              <FaStar
                key={index}
                className="w-4 h-4 dark:text-yellow-500 text-blue-500"
              />
            )
          );
          return (
            <div
              key={i}
              className="w-full flex flex-col items-start gap-2 border rounded-md shadow-md hover:bg-gray-300 dark:hover-gray-800 duration-300 p-2 capitalize"
            >
              <span className="w-full flex items-center justify-start">
                {stars}
              </span>
              <span className="w-full text-sm">{rate.review}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full flex items-center justify-center">
        <AddRatingReview profile={profile} />
      </div>
    </div>
  );
};
