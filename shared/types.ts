import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Basic user interface
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role?: string;
  avatar?: string;
  password?: string;
  createdAt?: Date;
}

// Request types
export interface AuthenticatedRequest extends Request<ParamsDictionary, any, any, ParsedQs> {
  user: User;
  isAuthenticated(): this is AuthenticatedRequest;
}

// Form data types
export type LoginFormData = {
  username: string;
  password: string;
};

export type RegisterFormData = LoginFormData & {
  name: string;
  role: string;
  avatar: string;
};

export type PostFormData = {
  userId: number;
  content: string;
};

export type ProfileFormData = {
  name: string;
  role: string;
  avatar: string;
};

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 