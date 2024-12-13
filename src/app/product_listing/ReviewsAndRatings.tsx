import React, { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { addRatingToPost, IUserProfile } from "@/store/userProfileSlice";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface AddRatingProps {
  profile: IUserProfile;
}

export const AddRatingReview: React.FC<AddRatingProps> = ({ profile }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>();

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        addRatingToPost({
          id: profile._id,
          rating: {
            farmer_rating: rating,
            review: review.trim() || undefined,
          },
        })
      ).unwrap();

      // Reset form after successful submission
      setRating(0);
      setHover(0);
      setReview("");

      toast({
        title: "Success!",
        description: "Review successfully submitted",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full m-2 bg-green-600 hover:bg-green-700 transition-colors duration-300 ease-in-out"
        >
          {profile?.ratings?.length && profile.ratings.length > 0
            ? `Add Feedback`
            : `Rate & Review ${profile.fullName}`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-xl shadow-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Share Your Thoughts
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Rate and Review, based on your trading experience with{" "}
            {profile.fullName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-center items-center space-x-2">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <Star
                  key={index}
                  className={`cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110 w-10 h-10 ${
                    index <= (hover || rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  fill={index <= (hover || rating) ? "#FFC107" : "none"}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                />
              );
            })}
          </div>
          <div className="text-center text-md text-gray-700 font-semibold">
            {rating > 0
              ? `You rated ${rating} out of 5 stars`
              : "Click on a star to rate"}
          </div>
          <Textarea
            placeholder={`Optional: Share your experience with ${profile.fullName}`}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full min-h-[120px] border-2 border-gray-200 focus:border-green-500 transition-all duration-300 ease-in-out rounded-lg"
          />
          <Button
            onClick={handleSubmitRating}
            disabled={rating === 0 || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
        <Toaster />
      </DialogContent>
    </Dialog>
  );
};
