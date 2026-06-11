import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { Category } from '../../domain/models/category.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { ConfigService } from '../../core/config.service';

interface CategoryDto {
  image_path: string;
  blog_category_name: string;
  id: string;
  isActive: string;
  blog_category_image_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiCategoryRepository implements CategoryRepository {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private getApiBase(): Observable<string> {
    return this.config.load().pipe(map(c => c.apiBaseUrl));
  }

  getCategories(): Observable<Category[]> {
    return this.getApiBase().pipe(
      switchMap(apiBase => this.http.post<ApiResponse<CategoryDto[]>>(`${apiBase}/message/getCategories`, {}).pipe(
        map(response => {
          if (response.result.code === '1' && response.data) {
            return response.data.map(dto => ({
              id: dto.id,
              name: dto.blog_category_name,
              slug: dto.blog_category_name.toLowerCase() 
            }));
          }
          return [];
        })
      ))
    );
  }
}
