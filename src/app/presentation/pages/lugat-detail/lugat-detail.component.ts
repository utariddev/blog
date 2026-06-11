import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { Post } from '../../../domain/models/post.model';
import { LugatRepository, LUGAT_REPOSITORY } from '../../../domain/repositories/lugat.repository';
import { ApiLugatRepository } from '../../../data/repositories/api-lugat.repository';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

declare var hljs: any;

@Component({
  selector: 'app-lugat-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [
    { provide: LUGAT_REPOSITORY, useClass: ApiLugatRepository }
  ],
  template: `
    <div class="detail-layout">
      <article class="post-article" *ngIf="post$ | async as post; else loading">
        
        <header class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span class="post-date">{{ post.publishedAt | date:'MMMM d, y' }}</span>
            <span class="post-updated" *ngIf="post.updatedAt && post.updatedAt !== post.publishedAt">{{ post.updatedAt | date:'MMMM d, y' }}</span>
            <div class="author-info">
              <span class="post-author">{{ post.author }}</span>
              <div class="author-avatar"></div>
            </div>
          </div>
        </header>

        <div class="post-image-wrapper" *ngIf="post.imageUrl">
          <img [src]="post.imageUrl" [alt]="post.title" class="post-detail-image">
        </div>

        <div class="post-content">
          <div [innerHTML]="post.content || post.excerpt"></div>
        </div>

        <div class="post-extra-info" *ngIf="post.categoryName || post.readCount">
          <a class="extra-category" *ngIf="post.categoryName" [routerLink]="['/category', post.categoryName]">{{ post.categoryName }}</a>
          <span class="extra-separator" *ngIf="post.categoryName && post.readCount">|</span>
          <span class="extra-read-container" *ngIf="post.readCount">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="book-icon" style="margin-right: 4px;">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span class="extra-read">{{ post.readCount }}</span>
          </span>
        </div>

      </article>

      <ng-template #loading>
        <p class="loading-text">Yükleniyor...</p>
      </ng-template>
    </div>
  `,
  styleUrls: ['./lugat-detail.component.css']
})
export class LugatDetailComponent implements OnInit {
  post$: Observable<Post | undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    @Inject(LUGAT_REPOSITORY) private lugatRepository: LugatRepository,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.post$ = this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        return this.lugatRepository.getWord(slug || '').pipe(
          tap(post => {
            if (post) {
              this.titleService.setTitle(`${post.title} | utarid lugat`);
              setTimeout(() => {
                if (typeof hljs !== 'undefined') {
                  hljs.highlightAll();
                }
              }, 0);
            }
          })
        );
      })
    );
  }
}