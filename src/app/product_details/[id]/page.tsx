"use client";
import { fetchPostedAds } from "@/store/postSlice";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import ActionButtons from "@/app/product_listing/ActionButtons";
import { ContactDialog } from "@/app/product_listing/FarmerContact";
import ProductImageGallery from "@/app/product_listing/ProductImageGallery";
import {
  FarmInformation,
  MoreDetailsComponent,
  ProductInformation,
} from "@/app/product_listing/MoreDetailsComponent";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchUserProfile } from "@/store/userProfileSlice";
import { FaStar } from "react-icons/fa";
import { Toaster } from "@/components/ui/toaster";

const ProductDetails = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const params = useParams();

  const paramsId = params.id as string;
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    dispatch(fetchPostedAds({}));
    dispatch(fetchUserProfile({}));
  }, [dispatch]);

  // Filter posts by paramId
  const filteredPost = posts.find((post) => post._id === paramsId);
  const currentPost = posts.find((post) => post._id === paramsId);

  // Filter posts by farm type
  const filteredPosts = posts.filter(
    (post) => post.farmType === filteredPost?.farmType
  );

  const userProfiles = useSelector(
    (state: RootState) => state.userProfile.profiles
  );

  const userProfile = useMemo(
    () => userProfiles.find((profile) => profile.userId === userId),
    [userProfiles, userId]
  );

  const averageRating = useMemo(() => {
    if (!userProfile?.ratings || userProfile.ratings.length === 0) return 0;

    const totalRating = userProfile.ratings.reduce(
      (sum, rating) => sum + rating.farmer_rating,
      0
    );
    return totalRating / userProfile.ratings.length;
  }, [userProfile?.ratings]);

  return (
    <main className="min-h-[80vh] w-full flex flex-col items-center gap-4 p-2">
      {loading ? (
        <section className="container mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
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
      ) : (
        filteredPost && (
          <div className="w-full flex flex-col items-center justify-between gap-4">
            <div
              className="w-full flex flex-col lg:flex-row items-start gap-4"
              key={filteredPost._id}
            >
              {/* Image Gallery - Full width on mobile, 1/3 on larger screens */}
              <div className="w-full lg:w-1/3 h-auto">
                <ProductImageGallery images={filteredPost.add_images} />
              </div>

              {/* Product Details - Full width on mobile, 2/3 on larger screens */}
              <div className="w-full lg:w-2/3 flex flex-col gap-4 bg-white/50 dark:bg-gray-950/50 rounded-md">
                {/* Header with Farm Name and Ratings */}
                <header className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 p-2 border rounded-md">
                  <div className="flex flex-col">
                    <span className="flex items-center justify-start gap-3">
                      {filteredPost.farmName}{" "}
                      <Badge
                        variant={"secondary"}
                        className={`text-sm ${
                          userProfile?.verified
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {userProfile?.verified ? "verified" : ""}
                      </Badge>
                    </span>
                    <small className="text-xs md:text-sm">
                      Posted by: {filteredPost.fullName} ({filteredPost.email}){" "}
                    </small>
                  </div>
                  <Link
                    href={"/profile/shared_profile"}
                    className="flex items-center gap-2 mt-2 md:mt-0"
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.floor(averageRating)
                              ? "text-blue-500 dark:text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <small className="capitalize text-xs md:text-sm">
                      ({userProfile?.ratings?.length || 0} Reviews)
                    </small>
                  </Link>
                </header>

                {/* Farm and Product Information */}
                <div className="flex flex-col gap-4">
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FarmInformation filteredPost={filteredPost} />
                    </div>
                    <div>
                      <ProductInformation filteredPost={filteredPost} />
                    </div>
                  </div>

                  <div>
                    <MoreDetailsComponent filteredPost={filteredPost} />
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 p-2 bg-gray-700 rounded-md text-white">
                    <ActionButtons postId={currentPost?._id ?? ""} />
                    <ContactDialog
                      post={filteredPost}
                      onContactInitiated={(postId) => {
                        console.log(`Contact initiated for post ${postId}`);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Related Farms Section */}
            <div className="w-full mt-4 border rounded-md p-4">
              <h2 className="text-xl font-semibold mb-4">Related Farms</h2>
              <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts
                  .filter((post) => post._id !== filteredPost._id)
                  .map((post) => (
                    <div key={post._id} className="w-full">
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
                                  <div className="w-full h-48 md:h-64 overflow-hidden">
                                    <Avatar className="group w-full h-full">
                                      <AvatarImage
                                        src={image.url}
                                        alt={`Ad image ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                      />
                                      <AvatarFallback>
                                        Image {index + 1}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <CardContent className="w-full p-4">
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <h3 className="text-sm md:text-lg font-bold capitalize">
                                          {post.product.item}
                                        </h3>
                                        <Badge
                                          variant={
                                            post.product.status
                                              ? "default"
                                              : "destructive"
                                          }
                                          className="flex items-center gap-1 text-xs md:text-sm"
                                        >
                                          {post.product.status ? (
                                            <>
                                              <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                                              Available
                                            </>
                                          ) : (
                                            <>
                                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                                              Sold
                                            </>
                                          )}
                                        </Badge>
                                      </div>
                                      <div className="text-xs md:text-sm">
                                        <p>
                                          Price: ${post.product.price}/
                                          {post.product.unit}
                                        </p>
                                        <p>
                                          Available Quantity:{" "}
                                          {post.product.quantity}
                                        </p>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1">
                                          <Camera size={12} />
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
                            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto hover:bg-white/50 rounded-full p-2 shadow-md z-20 hidden md:block" />
                            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto hover:bg-white/50 rounded-full p-2 shadow-md z-20 hidden md:block" />
                          </>
                        )}
                      </Carousel>
                    </div>
                  ))}
              </section>
            </div>
          </div>
        )
      )}
      <Toaster />
    </main>
  );
};

export default ProductDetails;
