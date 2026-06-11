import { Category } from './category.model';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string; // Short description
  content?: string; // Populated only on the detail page
  publishedAt: Date;
  updatedAt?: Date; // Updated date if different from publishedAt
  author: string;
  category?: Category;
  tags: string[];
  imageUrl?: string;
  commentCount: number;
  readCount?: string;
  categoryName?: string;
}
