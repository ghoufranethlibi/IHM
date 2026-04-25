import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiCacheService {
  private readonly cache = new Map<string, Observable<unknown>>();

  getOrSet<T>(key: string, factory: () => Observable<T>): Observable<T> {
    const existing = this.cache.get(key) as Observable<T> | undefined;
    if (existing) return existing;
    const value = factory().pipe(shareReplay(1));
    this.cache.set(key, value);
    return value;
  }

  invalidate(keyPrefix: string): void {
    [...this.cache.keys()].forEach((key) => {
      if (key.startsWith(keyPrefix)) {
        this.cache.delete(key);
      }
    });
  }

  clear(): void {
    this.cache.clear();
  }
}
