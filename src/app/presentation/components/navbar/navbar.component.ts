import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, shareReplay, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { Category } from '../../../domain/models/category.model';
import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { PostRepository } from '../../../domain/repositories/post.repository';
import { PostSuggestion } from '../../../domain/models/post.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <nav class="navbar">
      <!-- Hamburger Icon (Mobile Only) -->
      <button class="hamburger" (click)="toggleMobileMenu()" aria-label="Toggle Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="logo">
        <a routerLink="/">utarid</a>
      </div>
      
      <!-- Desktop Nav Links -->
      <div class="nav-links">
        <ng-container *ngIf="categories$ | async as categories">
          <ng-container *ngFor="let category of categories; let last = last">
            <a [routerLink]="['/category', category.slug]">{{ category.name }}</a>
            <span class="separator" *ngIf="!last">|</span>
          </ng-container>
        </ng-container>
      </div>

      <!-- Search Box -->
      <div class="search-wrapper" #searchWrapper>
        <div class="search-input-wrapper">
          <input
            type="search"
            class="search-input"
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            (keydown)="onKeydown($event)"
            (focus)="onFocus()"
            placeholder="Ara..."
            autocomplete="off"
            aria-label="Makale ara"
            #searchInput
          >
          <span class="search-icon" *ngIf="!isLoading" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
          <span class="search-loading" *ngIf="isLoading" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
          </span>
        </div>

        <!-- Suggestions Dropdown -->
        <div class="suggestions-dropdown" *ngIf="showSuggestions && suggestions.length > 0" role="listbox" aria-label="Arama önerileri">
          <div 
            class="suggestion-item" 
            *ngFor="let suggestion of suggestions; let i = index"
            [class.highlighted]="highlightedIndex === i"
            (click)="selectSuggestion(suggestion)"
            (mouseenter)="highlightedIndex = i"
            role="option"
          >
            <span class="suggestion-title">{{ suggestion.title }}</span>
            <span class="suggestion-category">{{ suggestion.category_name }}</span>
          </div>
          <div class="suggestion-empty" *ngIf="suggestions.length === 0 && !isLoading">
            Sonuç bulunamadı
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" [class.open]="isMobileMenuOpen" (click)="closeMobileMenu()">
      <div class="mobile-menu" (click)="$event.stopPropagation()" [class.open]="isMobileMenuOpen">
        <div class="mobile-menu-header">
          <span class="mobile-logo">utarid</span>
          <button class="close-btn" (click)="closeMobileMenu()">&times;</button>
        </div>
        <div class="mobile-nav-links">
          <ng-container *ngIf="categories$ | async as categories">
            <a *ngFor="let category of categories" [routerLink]="['/category', category.slug]" (click)="closeMobileMenu()">{{ category.name }}</a>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchWrapper', { static: true }) searchWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  isMobileMenuOpen = false;
  categories$: Observable<Category[]> | undefined;

  // Search autocomplete
  searchQuery = '';
  suggestions: PostSuggestion[] = [];
  showSuggestions = false;
  highlightedIndex = -1;
  isLoading = false;
  private searchSubject = new Subject<string>();

  constructor(
    private categoryRepository: CategoryRepository,
    private postRepository: PostRepository,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.router.url.startsWith('/admin')) {
      return;
    }
    this.categories$ = this.categoryRepository.getCategories().pipe(
      shareReplay(1)
    );

    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(query => {
        this.isLoading = true;
      }),
      switchMap(query => {
        if (!query || query.trim().length < 3) {
          return of([]);
        }
        return this.postRepository.getSuggestions(query.trim(), 5).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(results => {
      this.suggestions = results;
      this.highlightedIndex = -1;
      this.isLoading = false;
      this.showSuggestions = results.length > 0 && this.searchQuery.trim().length >= 3;
      this.cdr.markForCheck();
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFocus(): void {
    if (this.searchQuery.trim().length >= 3 && this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const query = this.searchQuery.trim();
    
    if (!this.showSuggestions || this.suggestions.length === 0) {
      if (event.key === 'Enter' && query.length >= 3) {
        event.preventDefault();
        this.navigateToSearchPage(query);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.suggestions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex >= 0) {
          this.selectSuggestion(this.suggestions[this.highlightedIndex]);
        } else {
          this.navigateToSearchPage(query);
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        this.searchInput.nativeElement.blur();
        break;
    }
  }

  selectSuggestion(suggestion: PostSuggestion): void {
    this.router.navigate(['/post', suggestion.web_title]);
    this.hideSuggestions();
    this.searchQuery = '';
  }

  private navigateToSearchPage(query: string): void {
    this.router.navigate(['/search'], { queryParams: { q: query } });
    this.hideSuggestions();
  }

  hideSuggestions(): void {
    this.showSuggestions = false;
    this.highlightedIndex = -1;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.searchWrapper && !this.searchWrapper.nativeElement.contains(event.target as Node)) {
      this.hideSuggestions();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }
}
