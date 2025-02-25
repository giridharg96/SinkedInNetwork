import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage.js";
import { setupAuth } from "./auth.js";
import type { User, AuthenticatedRequest } from "@shared/types";
import {
  insertUserSchema,
  insertPostSchema,
  insertCommentSchema,
  insertLikeSchema,
  insertFollowSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Set up authentication
  setupAuth(app);

  // Users
  app.post("/api/users", async (req: Request, res: Response) => {
    const result = insertUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const user = await storage.createUser(result.data);
    res.json(user);
  });

  app.get("/api/users", async (_req: Request, res: Response) => {
    const users = await storage.listUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      next();
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  };

  // Protected routes
  app.post("/api/posts", isAuthenticated, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = insertPostSchema.safeParse({
      ...authReq.body,
      userId: authReq.user.id,
    });
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    storage.createPost(result.data).then(post => res.json(post));
  });

  app.get("/api/posts", async (_req: Request, res: Response) => {
    const posts = await storage.listPosts();
    res.json(posts);
  });

  app.post("/api/comments", isAuthenticated, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = insertCommentSchema.safeParse({
      ...authReq.body,
      userId: authReq.user.id,
    });
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    storage.createComment(result.data).then(comment => res.json(comment));
  });

  app.get("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    const comments = await storage.listComments(parseInt(req.params.postId));
    res.json(comments);
  });

  app.post("/api/likes", isAuthenticated, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = insertLikeSchema.safeParse({
      ...authReq.body,
      userId: authReq.user.id,
    });
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    storage.createLike(result.data).then(like => res.json(like));
  });

  app.delete("/api/posts/:postId/likes", isAuthenticated, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    storage.deleteLike(parseInt(req.params.postId), authReq.user.id)
      .then(() => res.status(204).end());
  });

  app.get("/api/posts/:postId/likes", async (req: Request, res: Response) => {
    const likes = await storage.listLikes(parseInt(req.params.postId));
    res.json(likes);
  });

  app.post("/api/follows", isAuthenticated, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = insertFollowSchema.safeParse({
      ...authReq.body,
      followerId: authReq.user.id,
    });
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    storage.createFollow(result.data).then(follow => res.json(follow));
  });

  app.delete("/api/follows/:followingId", isAuthenticated, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    storage.deleteFollow(authReq.user.id, parseInt(req.params.followingId))
      .then(() => res.status(204).end());
  });

  app.get("/api/users/:userId/followers", async (req: Request, res: Response) => {
    const followers = await storage.listFollowers(parseInt(req.params.userId));
    res.json(followers);
  });

  app.get("/api/users/:userId/following", async (req: Request, res: Response) => {
    const following = await storage.listFollowing(parseInt(req.params.userId));
    res.json(following);
  });

  return httpServer;
}