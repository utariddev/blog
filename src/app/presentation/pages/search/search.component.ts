import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { switchMap, takeUntil, tap, catchError, distinctUntilChanged, delay, map } from 'rxjs/operators';
import { Post, SearchPostsRequest, SearchPostsResult } from '../../../domain/models/post.model';
import { PostRepository } from '../../../domain/repositories/post.repository';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  template: `
    <div class="search-page">
      <header class="search-header">
        <h1 class="search-title">
          <span class="search-label">Arama sonuçları:</span>
          <span class="search-query">{{ query }}</span>
        </h1>
        <p class="search-count" *ngIf="totalCount !== null">{{ totalCount }} sonuç bulundu</p>

        <!-- Top pagination -->
        <nav class="pagination pagination-top" *ngIf="showPagination">
          <button 
            class="page-btn" 
            (click)="prevPage()" 
            [disabled]="currentPage === 0"
            aria-label="Önceki sayfa">
            ← Önceki
          </button>
          <span class="page-info">Sayfa {{ currentPage + 1 }}</span>
          <button 
            class="page-btn" 
            (click)="nextPage()" 
            [disabled]="!hasMore"
            aria-label="Sonraki sayfa">
            Sonraki →
          </button>
        </nav>
      </header>

      <div class="search-content">
        <div class="results-grid">
          <ng-container *ngIf="posts$ | async as posts">
            <!-- Posts: show when not loading, or when on first page (initial load) -->
            <ng-container *ngIf="shouldShowPosts">
              <app-post-card *ngFor="let post of posts; let i = index" [post]="post" [index]="currentPage * pageSize + i + 1"></app-post-card>
            </ng-container>

            <!-- Skeleton cards during pagination loading (page > 0, empty posts, loading) -->
            <ng-container *ngIf="shouldShowSkeleton">
              <div class="skeleton-card" *ngFor="let _ of skeletonArray">
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                  <div class="skeleton-line skeleton-title"></div>
                  <div class="skeleton-line skeleton-meta"></div>
                  <div class="skeleton-line skeleton-excerpt"></div>
                  <div class="skeleton-line skeleton-excerpt short"></div>
                </div>
              </div>
            </ng-container>

            <!-- No results message (only when not loading and no posts) -->
            <div class="no-results" *ngIf="shouldShowNoResults">
              <p>«{{ query }}» için sonuç bulunamadı.</p>
            </div>
          </ng-container>

          <!-- Initial loading spinner (before first emission) -->
          <ng-container *ngIf="shouldShowInitialSpinner">
            <div class="search-loading-state">
              <div class="spinner"></div>
              <p>Aranıyor...</p>
            </div>
          </ng-container>
        </div>
      </div>

      <nav class="pagination" *ngIf="showPagination">
        <button 
          class="page-btn" 
          (click)="prevPage()" 
          [disabled]="currentPage === 0"
          aria-label="Önceki sayfa">
          ← Önceki
        </button>
        <span class="page-info">Sayfa {{ currentPage + 1 }}</span>
        <button 
          class="page-btn" 
          (click)="nextPage()" 
          [disabled]="!hasMore"
          aria-label="Sonraki sayfa">
          Sonraki →
        </button>
      </nav>
    </div>
  `,
  styles: [`
    .search-page {
      max-width: 960px;
      margin: 0 auto;
      padding: var(--spacing-xl) var(--spacing-md);
    }

    .search-header {
      margin-bottom: var(--spacing-lg);
      text-align: center;
    }

    .search-title {
      font-family: var(--font-family-heading);
      font-size: 2rem;
      font-weight: 300;
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-sm);
      letter-spacing: 1px;
    }

    .search-label {
      color: var(--color-text-secondary);
      font-weight: 400;
    }

    .search-query {
      color: var(--color-accent);
      font-weight: 600;
    }

    .search-count {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
      margin: 0;
    }

    .results-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .search-loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      color: var(--color-text-secondary);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--spacing-sm);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .no-results {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--color-text-muted);
      font-style: italic;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--color-border);
    }

    .page-btn {
      padding: var(--spacing-xs) var(--spacing-md);
      background-color: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      color: var(--color-text-primary);
      font-family: var(--font-family-base);
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
    }

    .page-btn:hover:not(:disabled) {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: white;
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-info {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }

    .pagination-top {
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--color-border);
      justify-content: center;
    }

    .skeleton-card {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background-color: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      animation: skeletonPulse 1.5s ease-in-out infinite;
    }

    .skeleton-image {
      width: 120px;
      height: 80px;
      background: linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-body) 50%, var(--color-border) 75%);
      background-size: 200% 100%;
      border-radius: 4px;
      flex-shrink: 0;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .skeleton-line {
      height: 12px;
      background: linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-body) 50%, var(--color-border) 75%);
      background-size: 200% 100%;
      border-radius: 4px;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-title {
      height: 20px;
      width: 70%;
    }

    .skeleton-meta {
      height: 14px;
      width: 40%;
    }

    .skeleton-excerpt {
      height: 14px;
      width: 100%;
    }

    .skeleton-excerpt.short {
      width: 60%;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes skeletonPulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
  posts$!: Observable<Post[]>;
  isLoading = false;
  totalCount: number | null = null;
  currentPage = 0;
  pageSize = 10;
  hasMore = false;
  showPagination = false;
  private destroy$ = new Subject<void>();
  private pageTrigger$ = new BehaviorSubject<number>(0);
  private latestPosts: Post[] = [];
  private hasLoadedOnce = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postRepository: PostRepository
  ) {}

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParams['q'] || '';

    this.posts$ = this.route.queryParams.pipe(
      takeUntil(this.destroy$),
      tap(params => {
        this.query = params['q'] || '';
        this.triggerPage(0);
      }),
      switchMap(() => this.pageTrigger$.pipe(
        distinctUntilChanged(),
        switchMap(() => this.fetchPosts()),
        tap(result => {
          this.latestPosts = result.posts;
          this.totalCount = result.totalCount;
          this.hasLoadedOnce = true;
          this.isLoading = false;
          this.hasMore = result.posts.length === this.pageSize;
          if (this.hasMore || this.currentPage > 0) {
            this.showPagination = true;
          }
        }),
        map(result => result.posts),
        catchError(err => {
          console.error('[Search] catchError:', err);
          this.isLoading = false;
          this.hasMore = false;
          return of([]);
        })
      ))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pageTrigger$.complete();
  }

  private fetchPosts(): Observable<SearchPostsResult> {
    const request: SearchPostsRequest = {
      query: this.query,
      indicator: this.currentPage,
      page_size: this.pageSize
    };

    return this.postRepository.searchPosts(request).pipe(
      delay(300)
    );
  }

  private triggerPage(page: number): void {
    this.isLoading = true;
    this.latestPosts = [];
    this.currentPage = page;
    this.pageTrigger$.next(page);
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.triggerPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.hasMore) {
      this.triggerPage(this.currentPage + 1);
    }
  }

  get shouldShowSkeleton(): boolean {
    return this.latestPosts.length === 0 && this.isLoading && this.hasLoadedOnce;
  }

  get shouldShowPosts(): boolean {
    return this.latestPosts.length > 0 && !this.isLoading;
  }

  get shouldShowNoResults(): boolean {
    return this.latestPosts.length === 0 && !this.isLoading && this.hasLoadedOnce;
  }

  get shouldShowInitialSpinner(): boolean {
    return this.latestPosts.length === 0 && this.isLoading && !this.hasLoadedOnce;
  }

  get skeletonArray(): number[] {
    return Array(this.pageSize).fill(0).map((_, i) => i);
  }
}