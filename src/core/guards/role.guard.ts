import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const roles = route.data['roles'] as UserRole[] | undefined;
    if (!roles || roles.length === 0) {
      return true;
    }
    if (this.auth.hasRole(...roles)) {
      return true;
    }
    return this.router.createUrlTree(['/dashboard']);
  }
}
