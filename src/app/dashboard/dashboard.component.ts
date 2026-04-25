import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DossierMedical, User } from '../../shared/models';
import { DossierService } from '../../core/services/dossier.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Stat { label: string; value: string; }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  stats: Stat[] = [];
  private readonly destroyRef = inject(DestroyRef);
  constructor(public auth: AuthService, private router: Router, private dossierService: DossierService) {}

  ngOnInit(): void {
    this.auth.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((u: User | null) => {
      this.user = u;
      if (!u) return;
      if (u.role === 'Patient') {
        this.dossierService.getMyDossier().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (dossier: DossierMedical) => this.stats = [
            { label: 'Consultations', value: String(dossier.consultations?.length ?? 0) },
            { label: 'Données vitales', value: String(dossier.donneesVitales?.length ?? 0) },
            { label: 'Examens', value: String(dossier.examens?.length ?? 0) },
            { label: 'Code patient', value: dossier.codeSecret || 'N/A' }
          ],
          error: () => this.stats = []
        });
      } else {
        this.stats = [];
      }
    });
  }

  get roleClass(): string {
    if (this.user?.role === 'Infirmier') return 'infirmier';
    if (this.user?.role === 'AgentMedical') return 'agent';
    if (this.user?.role === 'Patient') return 'patient';
    return 'medecin';
  }

  get roleWelcome(): string {
    if (this.user?.role === 'Admin') return 'Espace administrateur';
    if (this.user?.role === 'Medecin') return 'Espace médecin';
    if (this.user?.role === 'Infirmier') return 'Espace infirmier';
    if (this.user?.role === 'AgentMedical') return 'Espace agent médical';
    return 'Mon espace patient';
  }

  get roleDescription(): string {
    if (this.user?.role === 'Admin') return 'Gérez les utilisateurs, les accès et les rôles.';
    if (this.user?.role === 'Medecin') return 'Consultez les patients et suivez leurs dossiers.';
    if (this.user?.role === 'Infirmier') return 'Saisissez les constantes et suivez les dossiers.';
    if (this.user?.role === 'AgentMedical') return 'Enregistrez les examens médicaux demandés.';
    return 'Consultez votre dossier et vos consultations.';
  }

  get canSearch(): boolean { return this.auth.hasRole('Admin', 'Medecin', 'Infirmier', 'AgentMedical'); }
  get canConsult(): boolean { return this.auth.hasRole('Admin', 'Medecin'); }
  get canVitaux(): boolean { return this.auth.hasRole('Admin', 'Infirmier'); }
  get canExamen(): boolean { return this.auth.hasRole('Admin', 'AgentMedical'); }
  get isPatient(): boolean { return this.auth.hasRole('Patient'); }

  goSearch(): void { this.router.navigate(['/search']); }
  goConsultation(): void { this.router.navigate(['/dossier/consultations']); }
  goVitaux(): void { this.router.navigate(['/dossier/vitaux']); }
  goExamens(): void { this.router.navigate(['/dossier/examens']); }
  goMonDossier(): void { this.router.navigate(['/dossier/donnees-personnelles']); }

  trackByStat(_index: number, stat: Stat): string {
    return stat.label;
  }
}