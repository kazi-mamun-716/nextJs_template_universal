/**
 * User feature type definitions.
 */
export interface IUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserProfile {
  userId: string;
  bio?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}
