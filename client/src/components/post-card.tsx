import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Share2, UserIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Post, User, Comment } from "@shared/schema";

type PostCardProps = {
  post: Post;
  currentUserId: number;
};

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [comment, setComment] = useState("");

  const { data: author } = useQuery<User>({
    queryKey: [`/api/users/${post.userId}`],
  });

  const { data: comments } = useQuery<Comment[]>({
    queryKey: [`/api/posts/${post.id}/comments`],
  });

  const { data: likes } = useQuery<{ id: number; userId: number }[]>({
    queryKey: [`/api/posts/${post.id}/likes`],
  });

  const isLiked = likes?.some((like) => like.userId === currentUserId);

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await apiRequest(
          "DELETE",
          `/api/posts/${post.id}/likes/${currentUserId}`
        );
      } else {
        await apiRequest("POST", "/api/likes", {
          postId: post.id,
          userId: currentUserId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/posts/${post.id}/likes`],
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/comments", {
        postId: post.id,
        userId: currentUserId,
        content: comment,
      });
      setComment("");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/posts/${post.id}/comments`],
      });
    },
  });

  if (!author) return null;

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{author.name}</div>
            <div className="text-sm text-muted-foreground">{author.role}</div>
          </div>
          <div className="text-sm text-muted-foreground ml-auto">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>

        <p className="text-sm mb-4">{post.content}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{likes?.length || 0} likes</span>
          <span>{comments?.length || 0} comments</span>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="p-4">
        <div className="w-full space-y-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <Heart
                className={`h-5 w-5 mr-2 ${
                  isLiked ? "fill-primary text-primary" : ""
                }`}
              />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <MessageSquare className="h-5 w-5 mr-2" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              size="sm"
              disabled={!comment || commentMutation.isPending}
              onClick={() => commentMutation.mutate()}
            >
              Post
            </Button>
          </div>

          {comments && comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        comment.userId === author.id
                          ? author.avatar
                          : undefined
                      }
                    />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {comment.userId === author.id ? author.name : "User"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}