import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { ArticlesCountData } from '../models/article-count.model';

/**
 * This abstract class acts as a contract for fetching blog posts.
 * By depending on this contract instead of a concrete implementation,
 * the rest of the application remains agnostic to the data source (API, Local Storage, etc.).
 * (SOLID - Dependency Inversion Principle)
 */
export abstract class PostRepository {
  abstract getPosts(indicator?: string): Observable<Post[]>;
  abstract getPostBySlug(slug: string): Observable<Post | undefined>;
  abstract getPopularPosts(): Observable<Post[]>;
  abstract getPostsByCategory(categorySlug: string): Observable<Post[]>;
  abstract getArticlesCount(): Observable<ArticlesCountData>;
}
