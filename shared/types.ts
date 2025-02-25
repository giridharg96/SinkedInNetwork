export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  // add other necessary properties
}

// Add form types
export interface PostFormData {
  userId: number;
  content: string;
}

export interface ProfileFormData {
  name: string;
  role: string;
  avatar: string;
} 