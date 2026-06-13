import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { Post } from '../../../domain/models/post.model';
import { PostRepository } from '../../../domain/repositories/post.repository';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
template: `
    <aside class="sidebar">
      <div class="profile-section">
        <div class="logo-container">
          <img src="https://i.ibb.co/Yc9vnRk/logo.png" alt="utarid" class="main-logo-img">
        </div>
        <p class="subtitle">kendime yazılım notları</p>
      </div>

      <div class="divider"></div>

      <div class="popular-section">
        <h3 class="section-title">çok okunanlar</h3>
        
        <ng-container *ngIf="popularPosts$ | async as posts">
          <div class="popular-card" *ngFor="let post of posts" [routerLink]="['/post', post.slug]">
             <div>
                <img *ngIf="post.imageUrl; else noImage" [src]="post.imageUrl" [alt]="post.title" class="card-image">
                <ng-template #noImage>
                  <span class="placeholder-text">{{ post.tags[0] }}</span>
                </ng-template>
              </div>
              <div class="card-content">
                <p class="card-title">{{ post.title }}</p>
                <div class="card-footer">
                   <span class="card-date">{{ post.publishedAt | date:'MMMM d, y' }}</span>
                   <span class="card-updated" *ngIf="post.updatedAt && post.updatedAt !== post.publishedAt">{{ post.updatedAt | date:'MMMM d, y' }}</span>
                   <div class="card-circle"></div>
                </div>
              </div>
          </div>

          <div *ngIf="posts.length === 0 && !popularError" class="empty-popular">
            <p>Henüz popüler yazı yok.</p>
          </div>
          
          <div *ngIf="popularError" class="popular-error">
            <p>Popüler yazılar yüklenemedi.</p>
          </div>
        </ng-container>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  popularPosts$: Observable<Post[]> | undefined;
  popularError = false;

  constructor(private postRepository: PostRepository) {}

  ngOnInit(): void {
    this.popularPosts$ = this.postRepository.getPopularPosts().pipe(
      catchError(() => {
        this.popularError = true;
        return of([]);
      })
    );
  }
}
