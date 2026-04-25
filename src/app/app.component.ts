import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'DM';
  routeLoading = false;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    this.auth.initializeSession();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.routeLoading = true;
      });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.routeLoading = false;
      });
  }
}
