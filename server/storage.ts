import {
  User,
  Post,
  Comment,
  Like,
  Follow,
  InsertUser,
  InsertPost,
  InsertComment,
  InsertLike,
  InsertFollow,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;
  
  // Posts
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  listPosts(): Promise<Post[]>;
  
  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  listComments(postId: number): Promise<Comment[]>;
  
  // Likes
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(postId: number, userId: number): Promise<void>;
  listLikes(postId: number): Promise<Like[]>;
  
  // Follows
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followingId: number): Promise<void>;
  listFollowers(userId: number): Promise<Follow[]>;
  listFollowing(userId: number): Promise<Follow[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private likes: Map<number, Like>;
  private follows: Map<number, Follow>;
  private currentIds: {
    user: number;
    post: number;
    comment: number;
    like: number;
    follow: number;
  };

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.follows = new Map();
    this.currentIds = {
      user: 1,
      post: 1,
      comment: 1,
      like: 1,
      follow: 1,
    };
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Posts
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentIds.post++;
    const post: Post = {
      ...insertPost,
      id,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async listPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  // Comments
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentIds.comment++;
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async listComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.postId === postId
    );
  }

  // Likes
  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = this.currentIds.like++;
    const like: Like = {
      ...insertLike,
      id,
      createdAt: new Date(),
    };
    this.likes.set(id, like);
    return like;
  }

  async deleteLike(postId: number, userId: number): Promise<void> {
    const likeToDelete = Array.from(this.likes.values()).find(
      (like) => like.postId === postId && like.userId === userId
    );
    if (likeToDelete) {
      this.likes.delete(likeToDelete.id);
    }
  }

  async listLikes(postId: number): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(
      (like) => like.postId === postId
    );
  }

  // Follows
  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const id = this.currentIds.follow++;
    const follow: Follow = {
      ...insertFollow,
      id,
      createdAt: new Date(),
    };
    this.follows.set(id, follow);
    return follow;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<void> {
    const followToDelete = Array.from(this.follows.values()).find(
      (follow) =>
        follow.followerId === followerId && follow.followingId === followingId
    );
    if (followToDelete) {
      this.follows.delete(followToDelete.id);
    }
  }

  async listFollowers(userId: number): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(
      (follow) => follow.followingId === userId
    );
  }

  async listFollowing(userId: number): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(
      (follow) => follow.followerId === userId
    );
  }
}

export const storage = new MemStorage();
