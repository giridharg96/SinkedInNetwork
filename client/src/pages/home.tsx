import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { PostForm } from "@/components/post-form";
import { PostCard } from "@/components/post-card";
import { Loader2 } from "lucide-react";
import type { Post, User } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  // Check authentication status
  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/me"],
  });

  useEffect(() => {
    if (!userLoading && !currentUser) {
      setLocation("/auth");
    }
  }, [currentUser, userLoading, setLocation]);

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  if (userLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to /auth
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4">
        <PostForm userId={currentUser.id} />

        {postsLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUser.id}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No failures shared yet. Be the first to share!
          </div>
        )}
      </div>
    </Layout>
  );
}