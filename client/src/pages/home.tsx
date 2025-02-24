import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { ProfileForm } from "@/components/profile-form";
import { PostForm } from "@/components/post-form";
import { PostCard } from "@/components/post-card";
import type { Post, User } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: currentUser } = useQuery<User>({
    queryKey: [`/api/users/${currentUserId}`],
    enabled: !!currentUserId,
  });

  if (!currentUser && !currentUserId) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Welcome to SinkedIn
            </h1>
            <p className="text-lg text-muted-foreground">
              A safe space to share and learn from professional failures
            </p>
          </div>
          <ProfileForm onSuccess={(userId) => setCurrentUserId(userId)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4">
        {currentUser && <PostForm userId={currentUser.id} />}

        {postsLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading posts...
          </div>
        ) : posts && posts.length > 0 ? (
          <div>
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
                  currentUserId={currentUser?.id || 0}
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
