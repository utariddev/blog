import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../../domain/models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Changed article element to anchor tag to support native browser open in new tab functionality (SEO & Accessibility) -->
    <a class="post-card" [routerLink]="['/post', post.slug]">
      <!-- Left Section: Number taking full height -->
      <div class="card-left">
        <span class="post-index">{{ index }}</span>
      </div>
      
      <!-- Right Section: Content block (Vertical Flow) -->
      <div class="card-right-content">
        <!-- Top Section: Title, Author and Date -->
        <div class="card-top-header">
          <h2 class="post-title">{{ post.title }}</h2>
          <div class="header-right-meta">
            <span class="meta-separator"></span>
            <div class="post-meta" style="display: flex !important; flex-direction: column !important; align-items: flex-end !important; gap: 4px !important;">
              <span class="post-date">{{ post.publishedAt | date:'MMMM d, y' }}</span>
              <span class="post-updated" *ngIf="post.updatedAt && post.updatedAt !== post.publishedAt">{{ post.updatedAt | date:'MMMM d, y' }}</span>
              <div class="author-info">
                <span class="post-author">{{ post.author }}</span>
                <div class="author-avatar"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Thin Horizontal Line -->
        <div class="card-divider"></div>
        
        <!-- Bottom Section: Image, Category and Read Count Info -->
        <div class="card-bottom-body" *ngIf="post.imageUrl || post.categoryName || post.readCount">
          <div class="post-image-container" *ngIf="post.imageUrl">
            <img [src]="post.imageUrl" [alt]="post.title" class="post-image">
          </div>
          
          <!-- Category and Read Count Badge -->
          <div class="post-extra-info" *ngIf="post.categoryName || post.readCount">
            <!-- Clickable category link with route navigation, stops event propagation to prevent triggering parent card link -->
            <a class="extra-category" *ngIf="post.categoryName" [routerLink]="['/category', post.categoryName]" (click)="$event.stopPropagation()">{{ post.categoryName }}</a>
            <span class="extra-separator" *ngIf="post.categoryName && post.readCount">|</span>
            <span class="extra-read-container" *ngIf="post.readCount">
              <!-- Book Icon SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="book-icon" style="margin-right: 4px;">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span class="extra-read">{{ post.readCount }}</span>
            </span>
          </div>
        </div>
      </div>
    </a>
  `,
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent {
  // Inputs provided by parent component
  @Input() post!: Post;
  @Input() index!: number;
}
