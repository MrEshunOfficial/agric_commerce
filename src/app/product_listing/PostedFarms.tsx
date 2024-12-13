import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import Scroll Area

import { fetchPostedAds } from "@/store/postSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PostedFarms = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();

  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPostedAds({}));
  }, [dispatch]);

  // Loading state component
  if (loading) {
    return (
      <ScrollArea className="w-full h-full">
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 md:h-64 w-full" />
              <CardContent className="p-3 md:p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </ScrollArea>
    );
  }

  // Error state handling
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 sm:p-6 bg-red-50">
        <AlertCircle className="text-red-500 w-12 sm:w-16 h-12 sm:h-16 mb-2 sm:mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold text-red-700 mb-1 sm:mb-2">
          Unable to Load Farms
        </h2>
        <p className="text-sm sm:text-base text-red-600 text-center px-2 sm:px-0">
          There was an issue retrieving your farm listings. Please try again
          later or contact support.
        </p>
      </div>
    );
  }

  // Empty state handling
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 sm:p-6 bg-gray-50">
        <Camera className="text-gray-400 w-12 sm:w-16 h-12 sm:h-16 mb-2 sm:mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1 sm:mb-2">
          No Farms Posted
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-2 sm:mb-4 px-2 sm:px-0">
          {` You haven't posted any farm listings yet.`}
        </p>
        <Link
          href="/create-farm"
          className="px-4 py-1 sm:px-6 sm:py-2 text-sm sm:text-base bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Create New Farm Listing
        </Link>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full h-full">
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-4">
        {posts.map((post) => (
          <div key={post._id} className="w-full block relative">
            <Carousel className="w-full">
              <CarouselContent>
                {post?.add_images?.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="flex justify-center items-center"
                  >
                    <Link
                      href={`/product_details/${post._id}`}
                      className="w-full block"
                    >
                      <Card className="w-full group hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="w-full h-48 sm:h-64 overflow-hidden">
                          <Avatar className="group w-full h-full">
                            <AvatarImage
                              src={image.url}
                              alt={`Ad image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <AvatarFallback>Image {index + 1}</AvatarFallback>
                          </Avatar>
                        </div>
                        <CardContent className="w-full p-3 sm:p-4">
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex justify-between items-center">
                              <h3 className="text-base sm:text-lg font-bold capitalize truncate">
                                {post.product.item}
                              </h3>
                              <Badge
                                variant={
                                  post.product.status
                                    ? "default"
                                    : "destructive"
                                }
                                className="flex items-center gap-1 text-xs sm:text-sm"
                              >
                                {post.product.status ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Available
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Sold
                                  </>
                                )}
                              </Badge>
                            </div>
                            <div className="text-xs sm:text-sm">
                              <p className="truncate">
                                Price: ${post.product.price}/{post.product.unit}
                              </p>
                              <p>Available Quantity: {post.product.quantity}</p>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <Camera size={12} />
                                <span className="rounded-full px-1 py-0.5 sm:px-2 sm:py-1">
                                  {post?.add_images?.length} Images
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {post?.add_images && post.add_images.length > 1 && (
                <>
                  <CarouselPrevious className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto hover:bg-white/50 rounded-full p-1 sm:p-2 shadow-md z-20" />
                  <CarouselNext className="hidden sm:block absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto hover:bg-white/50 rounded-full p-1 sm:p-2 shadow-md z-20" />
                </>
              )}
            </Carousel>
          </div>
        ))}
      </section>
    </ScrollArea>
  );
};

export default PostedFarms;
