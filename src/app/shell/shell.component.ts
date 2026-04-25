import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type NavItem = { label: string; path: string };

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  breadcrumbs: string[] = [];
  private readonly destroyRef = inject(DestroyRef);

  constructor(readonly auth: AuthService, private readonly router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const url = this.router.url.split('?')[0];
        this.breadcrumbs = url.split('/').filter(Boolean).map((segment) => this.mapLabel(segment));
      });
  }

  logout(): void {
    this.auth.logout();
  }

  get navItems(): NavItem[] {
    if (this.auth.hasRole('Admin')) {
      return [
        { label: 'Tableau de bord', path: '/dashboard' },
        { label: 'Patients', path: '/search' },
        { label: 'Utilisateurs', path: '/admin/users' },
        { label: 'Rôles', path: '/admin/roles' }
      ];
    }
    if (this.auth.hasRole('Medecin')) {
      return [
        { label: 'Tableau de bord', path: '/dashboard' },
        { label: 'Patients', path: '/search' },
        { label: 'Dossier patient', path: '/dossier/donnees-personnelles' },
        { label: 'Consultations', path: '/dossier/consultations' }
      ];
    }
    if (this.auth.hasRole('Infirmier')) {
      return [
        { label: 'Tableau de bord', path: '/dashboard' },
        { label: 'Patients', path: '/search' },
        { label: 'Dossier médical', path: '/dossier/vitaux' }
      ];
    }
    return [
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'Mon dossier', path: '/dossier/donnees-personnelles' },
      { label: 'Mes consultations', path: '/dossier/consultations' }
    ];
  }

  private mapLabel(segment: string): string {
    const map: Record<string, string> = {
      dashboard: 'Tableau de bord',
      search: 'Patients',
      dossier: 'Dossier',
      'donnees-personnelles': 'Données personnelles',
      vitaux: 'Données vitales',
      consultations: 'Consultations',
      examens: 'Examens',
      admin: 'Administration',
      users: 'Utilisateurs',
      roles: 'Rôles'
    };
    return map[segment] ?? segment;
  }

  trackByPath(_index: number, item: NavItem): string {
    return item.path;
  }

  trackByCrumb(_index: number, crumb: string): string {
    return crumb;
  }
}