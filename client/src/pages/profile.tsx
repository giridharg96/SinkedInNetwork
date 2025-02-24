import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { UserIcon } from "lucide-react";
import type { User, Post } from "@shared/schema";
import { COVER_PHOTOS } from "@/lib/constants";

export default function Profile() {
  // In a real app, we'd get this from auth context
  const currentUserId = 1;

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${currentUserId}`],
  });

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: followers } = useQuery<{ id: number }[]>({
    queryKey: [`/api/users/${currentUserId}/followers`],
  });

  const { data: following } = useQuery<{ id: number }[]>({
    queryKey: [`/api/users/${currentUserId}/following`],
  });

  const userPosts = posts?.filter((post) => post.userId === currentUserId);

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-8 text-muted-foreground">
          Loading profile...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="mb-6 overflow-hidden">
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${COVER_PHOTOS[0]})` }}
        />
        <CardContent className="relative pt-0">
          <div className="flex flex-col sm:flex-row items-center gap-4 -mt-12 sm:-mt-16">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-background">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                <UserIcon className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.role}</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>

          <div className="flex gap-6 justify-center sm:justify-start mt-6">
            <div className="text-center">
              <div className="font-semibold">{userPosts?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Failures Shared</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{followers?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{following?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {userPosts && userPosts.length > 0 ? (
          userPosts
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((post) => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No failures shared yet. Start sharing your professional setbacks!
          </div>
        )}
      </div>
    </Layout>
  );
}