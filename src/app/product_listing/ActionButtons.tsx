import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Share2,
  Edit,
  Trash2,
  PinIcon,
  HeartIcon,
  ShoppingCart,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { deleteAdPost, togglePostFlag } from "@/store/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface ActionButtonsProps {
  postId: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts } = useSelector((state: RootState) => state.posts);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Find the specific post
  const currentPost = posts.find((post) => post._id === postId);

  // Check if the current user is the post owner
  const isPostOwner = currentPost?.userId === userId;

  // Handlers for different actions
  const handleDelete = () => {
    dispatch(deleteAdPost(postId))
      .then(() => {
        toast({
          title: "Post Deleted",
          description: "Your post has been successfully deleted.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to delete the post.",
          variant: "destructive",
        });
      });
  };

  const handleToggleFlag = (flag: "favorite" | "pinned" | "wishlist") => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      togglePostFlag({
        id: postId,
        flag,
      })
    )
      .then(() => {
        toast({
          title: `${flag.charAt(0).toUpperCase() + flag.slice(1)} Updated`,
          description: `Post ${flag} status has been updated.`,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to update ${flag} status.`,
          variant: "destructive",
        });
      });
  };

  const handleShare = () => {
    if (currentPost) {
      const postImage = currentPost.add_images?.[0] ?? "No image available";
      const shareText =
        `${postImage}\n` +
        `Farm Name: ${currentPost.farmName}\n` +
        `Location: ${currentPost.farmLocation}\n` +
        `Farm Size: ${currentPost.farmType}\n` +
        `Description: ${currentPost.description}\n` +
        `Contact: ${currentPost.phoneNumber}\n` +
        `Posted on: ${new Date(
          currentPost.createdAt
        ).toLocaleDateString()}\n\n` +
        `View full post: ${window.location.href}`;

      // Use Web Share API if available
      if (navigator.share) {
        navigator
          .share({
            title: `Farm Post: ${currentPost.farmName}`,
            text: shareText,
            url: window.location.href,
          })
          .then(() => {
            toast({
              title: "Post Shared",
              description: "Farm post shared successfully.",
            });
          })
          .catch((error) => {
            console.error("Share failed:", error);
            fallbackShare(shareText);
          });
      } else {
        fallbackShare(shareText);
      }
    } else {
      toast({
        title: "Share Error",
        description: "No post details available to share.",
        variant: "destructive",
      });
    }
  };

  const fallbackShare = (shareText: string) => {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast({
          title: "Post Details Copied",
          description: "Farm post details copied to clipboard.",
          variant: "default",
        });
      })
      .catch(() => {
        toast({
          title: "Share Error",
          description: "Could not copy post details.",
          variant: "destructive",
        });
      });
  };

  // Calculate favorites count
  const favoritesCount = posts.filter((post) => post.favorite).length;

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        {/* Favorite Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleToggleFlag("favorite")}
            >
              <HeartIcon
                className={`h-4 w-4 ${
                  currentPost?.favorite
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              />
              <span className="ml-1 text-xs text-gray-700 dark:text-gray-300">
                {favoritesCount}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Favorite</TooltipContent>
        </Tooltip>

        {/* Pin Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleToggleFlag("pinned")}
            >
              <PinIcon
                className={`h-4 w-4 ${
                  currentPost?.pinned
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Pin</TooltipContent>
        </Tooltip>

        {/* Wishlist Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleToggleFlag("wishlist")}
            >
              <ShoppingCart
                className={`h-4 w-4 ${
                  currentPost?.wishlist
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Wishlist</TooltipContent>
        </Tooltip>

        {/* Share Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>

        {/* Owner-specific actions */}
        {isPostOwner && (
          <>
            {/* Edit Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/edit-post/${postId}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            {/* Delete Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </>
        )}
      </TooltipProvider>
      <Toaster />
    </div>
  );
};

export default ActionButtons;
