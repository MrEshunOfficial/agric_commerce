import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Camera, Star, Pin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

const SortedPosts = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { posts, loading } = useSelector((state: RootState) => state.posts);

  // Filter pinned and favorite posts specific to the current user
  const pinnedPosts = posts.filter(
    (post) => Array.isArray(post.pinned) && post.pinned.includes(userId)
  );

  const favoritePosts = posts.filter(
    (post) => Array.isArray(post.favorite) && post.favorite.includes(userId)
  );

  // Loading state component
  if (loading) {
    return (
      <section className="w-full grid grid-cols-1 gap-6 p-4">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-auto w-full" />
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

  // Render empty state for no posts
  const EmptyState = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <div className="flex flex-col items-center justify-center h-full w-full p-2 rounded-lg">
      <Camera className="text-gray-400 w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-600 text-center mb-4">{description}</p>
    </div>
  );

  // Post list item component
  const PostListItem = ({
    post,
    type,
  }: {
    post: any;
    type: "pinned" | "favorite";
  }) => (
    <Link href={`/product_details/${post._id}`} className="w-full">
      <Card className="w-full flex items-center gap-3 hover:shadow-lg transition-shadow duration-300 overflow-hidden p-2 group mb-2">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={post.add_images?.[0]?.url || ""}
            alt={`${type} ad image`}
            className="w-full h-full object-cover rounded-full"
          />
          <AvatarFallback className="w-full h-full flex items-center justify-center">
            No Image
          </AvatarFallback>
        </Avatar>
        <CardContent className="flex-1 flex flex-col justify-center items-start space-y-1 p-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-md font-semibold truncate">
              {post.farmName}
            </CardTitle>
            {type === "pinned" ? (
              <Pin className="w-4 h-4 text-amber-500 inline" />
            ) : (
              <Star className="w-4 h-4 text-yellow-500 inline" />
            )}
          </div>
          <p className="text-gray-600 text-sm truncate capitalize">
            {post.product.item}
          </p>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <aside className="w-full h-full flex flex-col gap-2 shadow-sm rounded-lg overflow-hidden p-2">
      <div className="p-2 border-b">
        <h2 className="font-bold text-gray-800">My Pinned & Favorites Ads</h2>
      </div>

      {pinnedPosts.length === 0 && favoritePosts.length === 0 ? (
        <EmptyState
          title="No pinned or favorite Ad"
          description="You haven't pinned or favorite any ads yet"
        />
      ) : (
        <div className="flex flex-col gap-2 bg-gray-300/50 shadow-lg p-2 rounded-md">
          {pinnedPosts.length > 0 && (
            <div className="w-full flex-1">
              <div className="flex items-center gap-2">
                <Pin className="w-5 h-5 text-amber-600" />
                <p className="text-sm font-semibold text-gray-800">Pinned</p>
              </div>
              <ScrollArea className="h-64 w-full rounded-md border mt-2 p-0">
                <div className="w-full space-y-3">
                  {pinnedPosts.map((post) => (
                    <PostListItem key={post._id} post={post} type="pinned" />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {favoritePosts.length > 0 && (
            <div className="w-full flex-1">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <p className="text-sm font-semibold text-gray-800">Favorites</p>
              </div>
              <ScrollArea className="h-64 w-full rounded-md border mt-2 p-0">
                <div className="w-full space-y-3">
                  {favoritePosts.map((post) => (
                    <PostListItem key={post._id} post={post} type="favorite" />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default SortedPosts;
