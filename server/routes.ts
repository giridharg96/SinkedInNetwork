import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertPostSchema,
  insertCommentSchema,
  insertLikeSchema,
  insertFollowSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Users
  app.post("/api/users", async (req, res) => {
    const result = insertUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const user = await storage.createUser(result.data);
    res.json(user);
  });

  app.get("/api/users", async (_req, res) => {
    const users = await storage.listUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  // Posts
  app.post("/api/posts", async (req, res) => {
    const result = insertPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const post = await storage.createPost(result.data);
    res.json(post);
  });

  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.listPosts();
    res.json(posts);
  });

  // Comments
  app.post("/api/comments", async (req, res) => {
    const result = insertCommentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const comment = await storage.createComment(result.data);
    res.json(comment);
  });

  app.get("/api/posts/:postId/comments", async (req, res) => {
    const comments = await storage.listComments(parseInt(req.params.postId));
    res.json(comments);
  });

  // Likes
  app.post("/api/likes", async (req, res) => {
    const result = insertLikeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const like = await storage.createLike(result.data);
    res.json(like);
  });

  app.delete("/api/posts/:postId/likes/:userId", async (req, res) => {
    await storage.deleteLike(
      parseInt(req.params.postId),
      parseInt(req.params.userId)
    );
    res.status(204).end();
  });

  app.get("/api/posts/:postId/likes", async (req, res) => {
    const likes = await storage.listLikes(parseInt(req.params.postId));
    res.json(likes);
  });

  // Follows
  app.post("/api/follows", async (req, res) => {
    const result = insertFollowSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const follow = await storage.createFollow(result.data);
    res.json(follow);
  });

  app.delete("/api/follows/:followerId/:followingId", async (req, res) => {
    await storage.deleteFollow(
      parseInt(req.params.followerId),
      parseInt(req.params.followingId)
    );
    res.status(204).end();
  });

  app.get("/api/users/:userId/followers", async (req, res) => {
    const followers = await storage.listFollowers(parseInt(req.params.userId));
    res.json(followers);
  });

  app.get("/api/users/:userId/following", async (req, res) => {
    const following = await storage.listFollowing(parseInt(req.params.userId));
    res.json(following);
  });

  return httpServer;
}
