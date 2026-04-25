import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';

/**
 * Attaches `Authorization: Bearer` when a token exists (after login).
 * Uses `TokenStorageService` instead of `AuthService` to avoid HttpClient circular DI.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly tokens: TokenStorageService,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokens.getToken();
    if (!token) {
      return next.handle(req);
    }
    if (this.auth.isTokenExpired(token)) {
      this.auth.logout();
      return next.handle(req);
    }
    const request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/auth/login')) {
          this.auth.logout();
          void this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
