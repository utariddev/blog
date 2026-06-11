import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Post } from '../../domain/models/post.model';
import { LugatRepository } from '../../domain/repositories/lugat.repository';
import { ConfigService } from '../../core/config.service';

interface LugatWordDto {
  id: number;
  word: string;
  description: string;
  date: string;
  titles: string;
  read: number;
  user: {
    id: number;
    username: string;
  };
  active: boolean;
}

@Injectable()
export class ApiLugatRepository implements LugatRepository {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private getApiBase(): Observable<string> {
    return this.config.load().pipe(map(c => c.lugatApiBaseUrl));
  }

  getWord(slug: string): Observable<Post | undefined> {
    return this.getApiBase().pipe(
      switchMap(apiBase => this.http.get<LugatWordDto>(`${apiBase}/${slug}`).pipe(
        map(response => response ? this.mapToPost(response) : undefined)
      ))
    );
  }

  private mapToPost(dto: LugatWordDto): Post {
    return {
      id: dto.id.toString(),
      title: dto.word,
      slug: dto.titles,
      excerpt: dto.description,
      content: dto.description,
      publishedAt: new Date(dto.date),
      updatedAt: undefined,
      author: dto.user?.username || 'utarid',
      imageUrl: undefined,
      tags: [],
      commentCount: 0,
      readCount: dto.read?.toString() || '0',
      categoryName: ''
    };
  }
}