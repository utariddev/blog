import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, shareReplay } from 'rxjs';
import { Category } from '../../../domain/models/category.model';
import { CategoryRepository } from '../../../domain/repositories/category.repository';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink], // Standalone bileşenlerde kullanılan modüller buraya eklenir
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
  isMobileMenuOpen = false;
  categories$: Observable<Category[]> | undefined;

  constructor(private categoryRepository: CategoryRepository) {}

  ngOnInit(): void {
    this.categories$ = this.categoryRepository.getCategories().pipe(
      shareReplay(1) 
  );
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }
}
