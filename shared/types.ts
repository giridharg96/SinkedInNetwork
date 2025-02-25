// Basic user interface
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  password?: string;
}

// Request types
export interface AuthenticatedRequest extends Express.Request {
  user: User;
  isAuthenticated(): boolean;
}

// Form data types
export interface PostFormData {
  userId: number;
  content: string;
}

export interface ProfileFormData {
  name: string;
  role: string;
  avatar: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 