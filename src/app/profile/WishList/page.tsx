"use client";
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

import { fetchPostedAds } from "@/store/postSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

const WishListed = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPostedAds({}));
  }, [dispatch]);

  // filter posts by userId
  const userPosts = posts.filter((post) => post.userId === userId);
  // sort userPosts by wish list
  const wishList = userPosts.filter((post) => post.wishlist === true);
  
  // Loading state component
  if (loading) {
    return (
      <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  // Error state handling
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 bg-red-50">
        <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">
          Unable to Load Farms
        </h2>
        <p className="text-red-600 text-center">
          There was an issue retrieving your farm listings. Please try again
          later or contact support.
        </p>
      </div>
    );
  }

  // Empty state handling
  if (!wishList || wishList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 bg-gray-50">
        <Camera className="text-gray-400 w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No Wishlist added
        </h2>
        <p className="text-gray-600 text-center mb-4">{` no listings yet.`}</p>
      </div>
    );
  }

  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 p-2">
      {wishList.map((post) => (
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
                      <div className="w-full h-64 overflow-hidden">
                        <Avatar className="group w-full h-full">
                          <AvatarImage
                            src={image.url}
                            alt={`Ad image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform"
                          />
                          <AvatarFallback>Image {index + 1}</AvatarFallback>
                        </Avatar>
                      </div>
                      <CardContent className="w-full p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold capitalize">
                              {post.product.item}
                            </h3>
                            <Badge
                              variant={
                                post.product.status ? "default" : "destructive"
                              }
                              className="flex items-center gap-1"
                            >
                              {post.product.status ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Available
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4" />
                                  Sold
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <p>
                              Price: ${post.product.price}/{post.product.unit}
                            </p>
                            <p>Available Quantity: {post.product.quantity}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Camera size={16} />
                              <span className="rounded-full px-2 py-1">
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
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto hover:bg-white/50 rounded-full p-2 shadow-md z-20" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto hover:bg-white/50 rounded-full p-2 shadow-md z-20" />
              </>
            )}
          </Carousel>
        </div>
      ))}
    </section>
  );
};

export default WishListed;
