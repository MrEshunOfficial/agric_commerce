"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Loader2, Edit } from "lucide-react";

// Store and Validation
import { fetchPostedAds, updatePosts } from "@/store/postSlice";
import { RootState } from "@/store";
import { Form } from "@/components/ui/form";

// Import types and schemas
import {
  FarmProductFormData,
  FarmProductFormSchema,
  PostData,
} from "@/store/type/post.types";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { ProductInformation } from "../ProductInformation";

const PostUpdateForm: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();
  const router = useRouter();
  const params = useParams();

  const postId = params.id as string;
  const { posts, loading } = useSelector((state: RootState) => state.posts);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPostedAds({}));
  }, [dispatch]);

  // filter posts by postId
  const singlePost = posts.find((p) => p._id === postId);

  const form = useForm<FarmProductFormData>({
    resolver: zodResolver(FarmProductFormSchema),
    defaultValues: {
      product: {
        item: singlePost?.product.item,
        quantity: singlePost?.product.quantity,
        price: singlePost?.product.price,
        unit: singlePost?.product.unit,
        status: singlePost?.product.status,
      },
      harvest_details: {
        harvest_ready: singlePost?.harvest_details.harvest_ready,
        harvest_date: singlePost?.harvest_details.harvest_date,
        quality_grade: singlePost?.harvest_details?.quality_grade as
          | "A"
          | "B"
          | "C"
          | "Premium"
          | "Standard"
          | undefined,
      },
      pricing: {
        negotiable: singlePost?.pricing.negotiable,
        bulk_discount: singlePost?.pricing.bulk_discount,
      },
      logistics: {
        delivery_available: singlePost?.logistics.delivery_available,
        delivery_condition: singlePost?.logistics?.delivery_condition,
        delivery_cost: singlePost?.logistics.delivery_cost,
      },
      description: singlePost?.description,
      add_images: singlePost?.add_images || [],
    },
  });

  // Rest of the component remains the same...
  const onSubmit = async (data: FarmProductFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate form data manually before submission
      const validationResult = FarmProductFormSchema.safeParse(data);
      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors
          .map((err) => `${err.path.join(".")} - ${err.message}`)
          .join(", ");

        setSubmitError(`Validation Failed: ${errorMessages}`);
        setIsSubmitting(false);
        return;
      }

      // Prepare submission data
      const submissionData: Partial<PostData> = {
        _id: postId,
        userId: singlePost?.userId,
        farmName: singlePost?.farmName,
        fullName: singlePost?.fullName,
        phoneNumber: singlePost?.phoneNumber,
        email: singlePost?.email,
        farmLocation: singlePost?.farmLocation,
        farmType: singlePost?.farmType,
        cropFarmingType: singlePost?.cropFarmingType,
        livestockType: singlePost?.livestockType,
        description: data.description,
        product: data.product,
        harvest_details: data.harvest_details,
        pricing: data.pricing,
        logistics: data.logistics,
        add_images: data.add_images || [],
        updatedAt: new Date(),
        posted_at: new Date(),
      };

      // Update existing post
      await dispatch(
        updatePosts({
          id: postId,
          data: submissionData,
        })
      ).unwrap();

      // Redirect after successful update
      router.push(`/product_details/${postId}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while updating the ad";

      console.error("Full Error Object:", error);
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !isSubmitting;

  // Show loading state if data is still being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <main className="container p-2">
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {submitError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full flex flex-col items-center gap-2">
            <ProductInformation form={form} />
          </div>
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Update Ad
              </>
            )}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default PostUpdateForm;
