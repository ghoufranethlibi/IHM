import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthPayload, LoginRequest, RegisterRequest, User, UserRole } from '../../shared/models';
import { TokenStorageService } from './token-storage.service';

/**
 * Central auth state. Uses `environment.apiUrl` for login.
 * Token persistence is delegated to `TokenStorageService` so HTTP interceptors stay cycle-free.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(
    this.storage.getUser()
  );

  readonly currentUser$ = this.userSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly storage: TokenStorageService
  ) {}

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.storage.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  /**
   * True if the current user has any of the given roles.
   */
  hasRole(...roles: UserRole[]): boolean {
    const u = this.currentUser;
    if (!u) return false;
    return roles.includes(u.role);
  }

  login(email: string, password: string): Observable<User> {
    const body: LoginRequest = { email, password };
    return this.http
      .post<AuthPayload>(`${environment.apiUrl}/auth/login`, body)
      .pipe(
        tap((res) => {
          this.storage.write(res);
          this.userSubject.next(res.user);
        }),
        map((res) => res.user)
      );
  }

  register(email: string, password: string, role: string): Observable<void> {
    const body: RegisterRequest = { email, password, role };
    return this.http.post<void>(`${environment.apiUrl}/auth/register`, body);
  }

  logout(): void {
    this.storage.clearAllStorage();
    this.userSubject.next(null);
    void this.router.navigate(['/auth/login']);
  }

  getAuthToken(): string | null {
    return this.storage.getToken();
  }

  initializeSession(): void {
    const token = this.storage.getToken();
    const user = this.storage.getUser();
    if (!token || !user || this.isTokenExpired(token)) {
      this.storage.clearAllStorage();
      this.userSubject.next(null);
      if (!this.router.url.startsWith('/auth')) {
        void this.router.navigate(['/auth/login']);
      }
      return;
    }
    this.userSubject.next(user);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return true;
      const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(normalized));
      const exp = payload?.exp;
      if (typeof exp !== 'number') return true;
      return exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
