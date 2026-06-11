import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { Post } from '../../../domain/models/post.model';
import { PostRepository } from '../../../domain/repositories/post.repository';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostCardComponent, SidebarComponent],
  host: {
    '[attr.ngSkipHydration]': 'true'
  },
  template: `
    <div class="main-layout">
      <app-sidebar></app-sidebar>
      
      <main class="content-area">
        <div class="home-container">
          <!-- Skeleton Loader (Yükleniyor Durumu Animasyonu) -->
          <ng-container *ngIf="isLoading">
            <div class="skeleton-card" *ngFor="let i of [1, 2, 3, 4]; let idx = index">
              <div class="skeleton-left">
                <span class="skeleton-index">{{ (currentPage - 1) * pageSize + idx + 1 }}</span>
              </div>
              <div class="skeleton-center">
                <div class="skeleton-title-bar"></div>
              </div>
              <div class="skeleton-right">
                <div class="skeleton-meta-bar"></div>
              </div>
            </div>
          </ng-container>

          <!-- Hata Mesajı -->
          <ng-container *ngIf="!isLoading && errorMessage">
            <div class="error-state">
              <p>{{ errorMessage }}</p>
              <button class="retry-btn" (click)="loadPosts()">Tekrar Dene</button>
            </div>
          </ng-container>

          <!-- Gerçek Makaleler (Yükleme Tamamlandığında) -->
          <ng-container *ngIf="!isLoading && !errorMessage">
            <app-post-card 
              *ngFor="let post of displayedPosts; let i = index" 
              [post]="post" 
              [index]="(currentPage - 1) * pageSize + i + 1">
            </app-post-card>

            <div *ngIf="displayedPosts.length === 0" class="empty-state">
              <p>Henüz yazı bulunmuyor.</p>
            </div>
          </ng-container>
        </div>

        <!-- Pagination HTML -->
        <div class="pagination-container" *ngIf="totalPages > 1 && !isLoading && !errorMessage">
          <button 
            class="nav-btn" 
            [disabled]="currentPage === 1" 
            (click)="setPage(currentPage - 1)">
            önceki sayfa
          </button>

          <ng-container *ngFor="let page of getPaginationRange(currentPage, totalPages)">
            <span *ngIf="page === '...'" class="pagination-dots">...</span>
            
            <button 
              *ngIf="page !== '...'"
              class="page-btn"
              [class.active]="page === currentPage"
              (click)="setPage(page)">
              {{ page }}
            </button>
          </ng-container>

          <button 
            class="nav-btn" 
            [disabled]="currentPage === totalPages" 
            (click)="setPage(currentPage + 1)">
            sonraki sayfa
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      max-width: 1200px;
      margin: 0 auto; /* Sayfayı ortalar */
      min-height: calc(100vh - 60px);
    }
    .content-area {
      flex-grow: 1;
      padding: var(--spacing-lg);
      background-color: var(--color-bg-body);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .home-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    /* Skeleton Loader Styles */
    @keyframes skeleton-glow {
      0% {
        background-color: #f3f3f3;
      }
      50% {
        background-color: #e6e6e6;
      }
      100% {
        background-color: #f3f3f3;
      }
    }
    .skeleton-card {
      display: flex;
      background: #ffffff;
      border: 1px solid #f0f0f0;
      padding: var(--spacing-md);
      gap: var(--spacing-md);
      min-height: 90px;
      align-items: center;
      border-radius: 4px;
    }
    .skeleton-left {
      width: 50px;
      display: flex;
      justify-content: center;
    }
    .skeleton-index {
      font-size: 1.5rem;
      font-weight: 300;
      color: #ccc;
    }
    .skeleton-center {
      flex-grow: 1;
    }
    .skeleton-title-bar {
      height: 20px;
      width: 70%;
      border-radius: 4px;
      animation: skeleton-glow 1.5s infinite ease-in-out;
    }
    .skeleton-right {
      width: 180px;
      display: flex;
      justify-content: flex-end;
    }
    .skeleton-meta-bar {
      height: 16px;
      width: 120px;
      border-radius: 4px;
      animation: skeleton-glow 1.5s infinite ease-in-out;
    }
    
    /* Pagination Styles */
    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 32px;
      flex-wrap: wrap;
    }
    .pagination-container button {
      padding: 10px 16px;
      border: 1px solid #e0e0e0;
      background-color: #f7f7f7;
      color: #333;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .pagination-container button:hover:not([disabled]) {
      border-color: #00bfa5;
      background-color: #ffffff;
      color: #00bfa5;
    }
    .pagination-container button.active {
      border: 2px solid #00bfa5;
      background-color: #ffffff;
      color: #00bfa5;
      font-weight: bold;
    }
    .pagination-container button[disabled] {
      color: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }
    .pagination-dots {
      padding: 0 4px;
      color: #888;
      font-weight: bold;
    }

    .error-state {
      text-align: center;
      padding: var(--spacing-xl);
      color: #dc3545;
      background-color: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 8px;
      margin: var(--spacing-md) 0;
    }
    .error-state p {
      margin: 0 0 var(--spacing-md) 0;
      font-size: 1rem;
    }
    .retry-btn {
      padding: 10px 20px;
      background-color: #00bfa5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .retry-btn:hover {
      background-color: #009e8a;
    }
    .empty-state {
      text-align: center;
      padding: var(--spacing-xl);
      color: #888;
    }

    @media (max-width: 900px) {
      .main-layout {
        flex-direction: column-reverse; /* Mobilde sidebar'ı alta atar */
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  displayedPosts: Post[] = [];
  currentPage = 1;
  pageSize = 4;
  totalPages = 1;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private postRepository: PostRepository,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoading = true;
      this.errorMessage = null;
      this.postRepository.getArticlesCount().pipe(
        catchError(() => {
          this.isLoading = false;
          this.errorMessage = 'Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.';
          this.cdr.detectChanges();
          return of({ count: '0' });
        })
      ).subscribe(countData => {
        const totalCount = Number(countData?.count || 0);
        this.totalPages = Math.ceil(totalCount / this.pageSize);
        this.loadPosts();
        this.cdr.detectChanges();
      });
    }
  }

  loadPosts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();
    
    const indicator = (this.currentPage - 1).toString();
    this.postRepository.getPosts(indicator).pipe(
      catchError(() => {
        this.isLoading = false;
        this.errorMessage = 'Yazılar yüklenemedi. Sunucuya bağlanılamıyor.';
        this.cdr.detectChanges();
        return of([]);
      })
    ).subscribe({
      next: (posts) => {
        this.displayedPosts = posts || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setPage(page: number | string): void {
    const pageNumber = Number(page);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.loadPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfa değiştiğinde yukarı kaydırır
    }
  }

  getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
    const delta = 1; // Aktif sayfanın sağında ve solunda kaç sayfa gösterilecek
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }
}
