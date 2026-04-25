import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AdminService, AdminUser } from '../../core/services/admin.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-roles',
  template: `
  <section class="page">
    <h1>Rôles</h1>
    <p class="sub">Répartition des rôles des comptes en attente.</p>
    <div class="cards" *ngIf="roleRows.length; else emptyState">
      <article class="card" *ngFor="let r of roleRows; trackBy: trackByRole">
        <div class="name">{{ r.name }}</div>
        <div class="count">{{ r.count }}</div>
      </article>
    </div>
    <ng-template #emptyState>
      <div class="empty">Aucune donnée de rôle à afficher pour le moment.</div>
    </ng-template>
  </section>
  `,
  styles: [`
    .page { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    h1 { color: #3d348f; }
    .sub { color: #6a6790; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .card { background: #fff; border: 1px solid #dedafb; border-radius: 10px; padding: 16px; }
    .name { color: #6b62c8; font-weight: 600; }
    .count { font-size: 1.8rem; color: #3d348f; margin-top: 8px; }
    .empty { border: 1px dashed #d4d0fb; border-radius: 10px; padding: 20px; color: #7d79a7; background: #faf9ff; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRolesComponent implements OnInit {
  roleRows: Array<{ name: string; count: number }> = [];
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPendingUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (users) => this.roleRows = this.toRows(users),
      error: () => this.roleRows = []
    });
  }

  private toRows(users: AdminUser[]): Array<{ name: string; count: number }> {
    const counts = new Map<string, number>();
    users.forEach((u) => {
      const role = u.role?.name || 'ROLE_INCONNU';
      counts.set(role, (counts.get(role) ?? 0) + 1);
    });
    return [...counts.entries()].map(([name, count]) => ({ name, count }));
  }

  trackByRole(_index: number, role: { name: string; count: number }): string {
    return role.name;
  }
}
