import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

export interface LugatRepository {
  getWord(slug: string): Observable<Post | undefined>;
}

export const LUGAT_REPOSITORY = new InjectionToken<LugatRepository>('LugatRepository');