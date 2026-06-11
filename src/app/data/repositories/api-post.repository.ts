import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Post } from '../../domain/models/post.model';
import { PostRepository } from '../../domain/repositories/post.repository';
import { ArticlesCountData } from '../../domain/models/article-count.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { ConfigService } from '../../core/config.service';

interface ArticleDto {
  id: string;
  article_title: string;
  article_web_title: string;
  article_summary: string;
  article_text?: string;
  article_date: string;
  article_update_date?: string;
  author_name: string;
  article_image?: string;
  blog_category_name?: string;
  article_read?: string;
}

/**
 * Helper function to clean leading spaces/newlines immediately following <pre><code> tags
 */
function cleanArticleText(text?: string): string {
  if (!text) return '';
  return text.replace(/<pre><code>\s+/g, '<pre><code>');
}

function isSameDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

@Injectable({
  providedIn: 'root'
})
export class ApiPostRepository implements PostRepository {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private getApiBase(): Observable<string> {
    return this.config.load().pipe(map(c => c.apiBaseUrl));
  }

  getArticlesCount(): Observable<ArticlesCountData> {
    return this.getApiBase().pipe(
      switchMap(apiBase => this.http.post<ApiResponse<ArticlesCountData>>(`${apiBase}/message/getArticlesCount`, {}).pipe(
        map(response => {
          if (response && response.data) {
            return response.data;
          }
          return { count: '0' };
        })
      ))
    );
  }

  getPosts(indicator?: string): Observable<Post[]> {
    const payload = { indicator: indicator || '0' };
    return this.getApiBase().pipe(
      switchMap(apiBase => this.http.post<ApiResponse<ArticleDto[]>>(`${apiBase}/message/getArticles`, payload).pipe(
        map(response => {
          if (response && response.result.code === '1' && response.data) {
            return response.data.map(dto => ({
              id: dto.id,
              title: dto.article_title,
              slug: dto.article_web_title,
              excerpt: dto.article_summary || dto.article_text || '',
              content: cleanArticleText(dto.article_text),
              publishedAt: new Date(dto.article_date),
              updatedAt: dto.article_update_date && !isSameDay(dto.article_update_date, dto.article_date) ? new Date(dto.article_update_date) : undefined,
              author: dto.author_name,
              imageUrl: dto.article_image || undefined,
              tags: dto.blog_category_name ? [dto.blog_category_name.toLowerCase()] : [],
              commentCount: 0,
              readCount: dto.article_read || '0',
              categoryName: dto.blog_category_name || ''
            }));
          }
          return [];
        })
      ))
    );
  }

  getPostBySlug(slug: string): Observable<Post | undefined> {
    const payload = { articleID: slug };

    // Fetch a single article's detail dynamically from the server using the article ID/slug
    return this.getApiBase().pipe(
      switchMap(apiBase => this.http.post<ApiResponse<ArticleDto>>(`${apiBase}/message/getArticle`, payload).pipe(
        map(response => {
          if (response && response.result.code === '1' && response.data) {
            const dto = response.data;
            return {
              id: dto.id,
              title: dto.article_title,
              slug: dto.article_web_title,
              excerpt: dto.article_summary || dto.article_text || '',
              content: cleanArticleText(dto.article_text),
              publishedAt: new Date(dto.article_date),
              updatedAt: dto.article_update_date && !isSameDay(dto.article_update_date, dto.article_date) ? new Date(dto.article_update_date) : undefined,
              author: dto.author_name,
              imageUrl: dto.article_image || undefined,
              tags: dto.blog_category_name ? [dto.blog_category_name.toLowerCase()] : [],
              commentCount: 0,
              readCount: dto.article_read || '0',
              categoryName: dto.blog_category_name || ''
            };
          }
          return undefined;
        })
      ))
    );
  }

  getPopularPosts(): Observable<Post[]> {
    return this.getApiBase().pipe(
      switchMap(apiBase => this.http.post<ApiResponse<ArticleDto[]>>(`${apiBase}/message/getMostReadArticles`, {}).pipe(
        map(response => {
          if (response && response.result.code === '1' && response.data) {
            return response.data.map(dto => ({
              id: dto.id,
              title: dto.article_title,
              slug: dto.article_web_title,
              excerpt: dto.article_summary || dto.article_text || '',
              content: cleanArticleText(dto.article_text),
              publishedAt: new Date(dto.article_date),
              updatedAt: dto.article_update_date && !isSameDay(dto.article_update_date, dto.article_date) ? new Date(dto.article_update_date) : undefined,
              author: dto.author_name,
              imageUrl: dto.article_image || undefined,
              tags: dto.blog_category_name ? [dto.blog_category_name.toLowerCase()] : [],
              commentCount: 0,
              readCount: dto.article_read || '0',
              categoryName: dto.blog_category_name || ''
            }));
          }
          return [];
        })
      ))
    );
  }

  getPostsByCategory(categorySlug: string): Observable<Post[]> {
    const payload = { categoryName: categorySlug };
    
    // Fetch articles from the server filtered by category name
    return this.getApiBase().pipe(
      switchMap(apiBase => this.http.post<ApiResponse<ArticleDto[]>>(`${apiBase}/message/getCategoryArticles`, payload).pipe(
        map(response => {
          if (response && response.result.code === '1' && response.data) {
            return response.data.map(dto => ({
              id: dto.id,
              title: dto.article_title,
              slug: dto.article_web_title,
              excerpt: dto.article_summary || dto.article_text || '',
              content: cleanArticleText(dto.article_text),
              publishedAt: new Date(dto.article_date),
              updatedAt: dto.article_update_date && !isSameDay(dto.article_update_date, dto.article_date) ? new Date(dto.article_update_date) : undefined,
              author: dto.author_name,
              imageUrl: dto.article_image || undefined,
              tags: dto.blog_category_name ? [dto.blog_category_name.toLowerCase()] : [],
              commentCount: 0,
              readCount: dto.article_read || '0',
              categoryName: dto.blog_category_name || ''
            }));
          }
          return [];
        })
      ))
    );
  }
}
