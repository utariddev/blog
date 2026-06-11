import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { PostRepository } from './domain/repositories/post.repository';
import { ApiPostRepository } from './data/repositories/api-post.repository';
import { CategoryRepository } from './domain/repositories/category.repository';
import { ApiCategoryRepository } from './data/repositories/api-category.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: PostRepository, useClass: ApiPostRepository },
    { provide: CategoryRepository, useClass: ApiCategoryRepository }
  ],
};
