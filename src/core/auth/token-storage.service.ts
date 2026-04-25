import { Injectable } from '@angular/core';
import { AuthPayload, User } from '../../shared/models';

const STORAGE_KEY = 'dm_auth';

/**
 * Persists auth payload without depending on HttpClient (avoids interceptor ↔ AuthService cycles).
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  read(): AuthPayload | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthPayload;
    } catch {
      return null;
    }
  }

  write(payload: AuthPayload): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.removeItem(STORAGE_KEY);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  getToken(): string | null {
    return this.read()?.token ?? null;
  }

  getUser(): User | null {
    return this.read()?.user ?? null;
  }

  clearAllStorage(): void {
    this.clear();
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  }
}
