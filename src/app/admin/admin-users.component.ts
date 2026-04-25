import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AdminService, AdminUser } from '../../core/services/admin.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-users',
  template: `
  <section class="page">
    <h1>Gestion des utilisateurs</h1>
    <p class="sub">Validez les comptes en attente.</p>

    <div class="empty" *ngIf="!loading && users.length === 0">Aucun utilisateur en attente.</div>
    <div class="table" *ngIf="users.length > 0">
      <div class="row head"><span>Email</span><span>Rôle</span><span>Matricule</span><span></span></div>
      <div class="row" *ngFor="let u of users; trackBy: trackByUser">
        <span>{{ u.email }}</span>
        <span>{{ u.role?.name || 'N/A' }}</span>
        <span>{{ u.registrationNumber || 'N/A' }}</span>
        <button (click)="approve(u)">Approuver</button>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .page { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    h1 { color: #3d348f; }
    .sub { color: #6a6790; }
    .table { border: 1px solid #dcd9f7; border-radius: 10px; background: #fff; }
    .row { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 8px; padding: 12px; border-bottom: 1px solid #efedff; align-items: center; }
    .row:last-child { border-bottom: none; }
    .head { background: #f4f2ff; font-weight: 600; color: #3d348f; }
    button { border: none; background: #534ab7; color: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
    .empty { border: 1px dashed #d4d0fb; border-radius: 10px; padding: 20px; color: #7d79a7; background: #faf9ff; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  loading = true;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.reload();
  }

  approve(user: AdminUser): void {
    this.adminService.approveUser(user.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.reload());
  }

  private reload(): void {
    this.loading = true;
    this.adminService.getPendingUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.users = [];
        this.loading = false;
      }
    });
  }

  trackByUser(_index: number, user: AdminUser): number {
    return user.id;
  }
}
