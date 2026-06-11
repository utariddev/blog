import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/pages/home/home.component';
import { PostDetailComponent } from './presentation/pages/post-detail/post-detail.component';
import { CategoryComponent } from './presentation/pages/category/category.component';
import { LugatDetailComponent } from './presentation/pages/lugat-detail/lugat-detail.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'utarid'
  },
  {
    path: 'post/:slug', // Dynamic routing for details
    component: PostDetailComponent,
    title: 'utarid'
  },
  {
    path: 'category/:slug', // Dynamic routing for categories
    component: CategoryComponent,
    title: 'utarid'
  },
  {
    path: 'lugat/:slug', // Lugat detail page
    component: LugatDetailComponent,
    title: 'Lugat'
  }
];
