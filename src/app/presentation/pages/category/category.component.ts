import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap, catchError, of, map } from 'rxjs';
import { Post } from '../../../domain/models/post.model';
import { PostRepository } from '../../../domain/repositories/post.repository';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  template: `
    <div class="category-layout">
      
      <div class="category-container">
        <!-- Skeleton Loader (Shown while isLoading is true) -->
        <ng-container *ngIf="isLoading">
          <div class="skeleton-card" *ngFor="let i of [1, 2, 3]; let idx = index">
            <div class="skeleton-left">
              <span class="skeleton-index">{{ idx + 1 }}</span>
            </div>
            <div class="skeleton-center">
              <div class="skeleton-title-bar"></div>
            </div>
            <div class="skeleton-right">
              <div class="skeleton-meta-bar"></div>
            </div>
          </div>
        </ng-container>

        <!-- Real Posts (Shown once loaded and not empty) -->
        <ng-container *ngIf="!isLoading && (posts$ | async) as posts">
          
          <app-post-card 
            *ngFor="let post of posts; let i = index" 
            [post]="post" 
            [index]="i + 1">
          </app-post-card>

          <!-- Empty category state message -->
          <div *ngIf="posts.length === 0" class="empty-state">
            <p>Bu kategoride henüz yazı bulunmuyor.</p>
          </div>

        </ng-container>
      </div>

    </div>
  `,
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  posts$: Observable<Post[]> | undefined;
  categoryName: string = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private postRepository: PostRepository,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.posts$ = this.route.paramMap.pipe(
      tap(params => {
        this.categoryName = params.get('slug') || '';
        this.isLoading = true;
      }),
      switchMap(params => {
        const slug = params.get('slug') || '';
        return this.postRepository.getPostsByCategory(slug).pipe(
          tap(posts => {
            this.isLoading = false;
            if (posts.length > 0) {
              const displayName = posts[0].categoryName || this.formatCategoryName(this.categoryName);
              this.titleService.setTitle(`${displayName} | utarid`);
            } else {
              this.titleService.setTitle(`${this.formatCategoryName(this.categoryName)} | utarid`);
            }
          }),
          catchError(() => {
            this.isLoading = false;
            this.titleService.setTitle(`${this.formatCategoryName(this.categoryName)} | utarid`);
            return of([]);
          })
        );
      })
    );
  }

  private formatCategoryName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
