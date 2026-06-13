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

export interface PostSuggestion {
  id: string;
  title: string;
  web_title: string;
  category_name: string;
}

export interface SearchPostsRequest {
  query: string;
  indicator: number;
  page_size: number;
}

export interface SearchPostsResponse {
  result: {
    code: string;
    message: string;
  };
  data: unknown[];
  total_count?: number;
}

export interface SearchPostsResult {
  posts: Post[];
  totalCount: number;
}
