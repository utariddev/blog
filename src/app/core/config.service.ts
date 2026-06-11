import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';

export interface AppConfig {
  apiBaseUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  load(): Observable<AppConfig> {
    if (this.config) {
      return of(this.config);
    }

    return this.http.get<AppConfig>('/assets/config.json').pipe(
      map(config => {
        this.config = config;
        return config;
      }),
      catchError(() => {
        const fallback: AppConfig = { apiBaseUrl: '/rest' };
        this.config = fallback;
        return of(fallback);
      })
    );
  }

  get apiBaseUrl(): string {
    return this.config?.apiBaseUrl || '/rest';
  }
}