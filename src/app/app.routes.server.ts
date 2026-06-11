import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'category/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'lugat/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
