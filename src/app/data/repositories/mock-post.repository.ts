import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../../domain/models/post.model';
import { PostRepository } from '../../domain/repositories/post.repository';
import { ArticlesCountData } from '../../domain/models/article-count.model';

/**
 * Mock implementation of PostRepository for development and testing purposes.
 * This class provides static data without needing a real backend API.
 * 
 * @Injectable is used to make this class available in Angular's Dependency Injection system.
 */
@Injectable({
  providedIn: 'root'
})
export class MockPostRepository implements PostRepository {
  
  // Static mock data based on the provided design
  private posts: Post[] = [
    {
      id: '1',
      title: 'spring security: temeller',
      slug: 'spring-security-temeller',
      excerpt: 'Spring security temel konseptleri ve uygulamaları...',
      publishedAt: new Date('2025-09-07'),
      author: 'utarid',
      tags: ['java'],
      commentCount: 24,
      imageUrl: '/assets/spring-logo.svg', // Added SVG path
      readCount: '25',
      categoryName: 'java'
    },
    {
      id: '2',
      title: "linux'te wifi yapılandırması",
      slug: 'linux-wifi-yapilandirmasi',
      excerpt: 'Linux işletim sisteminde wifi yapılandırması için wpa_supplicant kullanımı...',
      publishedAt: new Date('2023-05-08'),
      author: 'utarid',
      tags: ['linux'],
      commentCount: 0,
      imageUrl: '/assets/tux-logo.svg', // Added SVG path
      readCount: '0',
      categoryName: 'linux'
    },
    {
      id: '3',
      title: 'grep kullanımı',
      slug: 'grep-kullanimi',
      excerpt: 'Linux ortamında grep komutunun detaylı kullanımı...',
      publishedAt: new Date('2020-08-09'),
      author: 'utarid',
      tags: ['linux'],
      commentCount: 0,
      readCount: '0',
      categoryName: 'linux'
    },
    {
      id: '4',
      title: 'bill pugh singleton design',
      slug: 'bill-pugh-singleton',
      excerpt: 'Java ortamında Bill Pugh Singleton tasarım deseninin kullanımı.',
      publishedAt: new Date('2025-01-18'),
      author: 'utarid',
      tags: ['programlama', 'java'],
      commentCount: 0,
      readCount: '0',
      categoryName: 'java'
    },
    {
      id: '5',
      title: 'singleton nesnelerde readresolve() kullanımı',
      slug: 'singleton-readresolve',
      excerpt: 'Serialization işlemlerinde singleton yapısının bozulmasını engellemek.',
      publishedAt: new Date('2025-01-12'),
      author: 'utarid',
      tags: ['programlama', 'java'],
      commentCount: 0,
      readCount: '0',
      categoryName: 'java'
    },
    {
      id: '6',
      title: 'enum sabiti singleton mıdır ?',
      slug: 'enum-singleton',
      excerpt: 'Java\'da Enum yapısının doğuştan thread-safe singleton olması.',
      publishedAt: new Date('2025-01-11'),
      author: 'utarid',
      tags: ['programlama', 'java'],
      commentCount: 0,
      readCount: '0',
      categoryName: 'java'
    }
  ];

  /**
   * Fetches all posts.
   * We use 'of' from RxJS to wrap our static array in an Observable,
   * simulating an asynchronous HTTP request.
   */
  getPosts(indicator?: string): Observable<Post[]> {
    if (indicator !== undefined) {
      // Mock paging if indicator is provided
      const start = Number(indicator) || 0;
      return of(this.posts.slice(start, start + 4));
    }
    return of(this.posts);
  }

  /**
   * Fetches a single post by its slug (URL friendly string).
   */
  getPostBySlug(slug: string): Observable<Post | undefined> {
    const post = this.posts.find(p => p.slug === slug);
    return of(post);
  }

  /**
   * Fetches popular posts (e.g., for the sidebar).
   * For this mock, we just return the first two posts.
   */
  getPopularPosts(): Observable<Post[]> {
    return of(this.posts.slice(0, 2));
  }

  /**
   * Fetches posts filtered by a specific category (using tags as category for this mock)
   */
  getPostsByCategory(categorySlug: string): Observable<Post[]> {
    const filtered = this.posts.filter(p => p.tags.includes(categorySlug));
    return of(filtered);
  }

  getArticlesCount(): Observable<ArticlesCountData> {
    return of({ count: this.posts.length.toString() });
  }
}
