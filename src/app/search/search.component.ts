import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/auth/auth.service';
import { DossierService } from '../../core/services/dossier.service';
import { DossierMedical, DonneesPersonnelles } from '../../shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SearchComponent {
  codeSecret = '';
  loading = false;
  searchError = '';
  dossier: DossierMedical | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private dossierService: DossierService,
    public auth: AuthService,
    private router: Router
  ) {}

  get canConsult(): boolean { return this.auth.hasRole('Admin', 'Medecin'); }
  get canVitaux():  boolean { return this.auth.hasRole('Admin', 'Infirmier'); }
  get canExamen():  boolean { return this.auth.hasRole('Admin', 'AgentMedical'); }

  get totalExamens(): number {
    if (!this.dossier?.examens) return 0;
    return this.dossier.examens.length;
  }

  search(): void {
    if (!this.codeSecret.trim()) return;
    this.loading = true;
    this.searchError = '';
    this.dossier = null;

    this.dossierService.getFullDossier(this.codeSecret.trim().toUpperCase()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (d: DossierMedical) => { this.loading = false; this.dossier = d; },
      error: (err: { status?: number }) => {
        this.loading = false;
        this.searchError = err.status === 404
          ? 'Aucun dossier trouvé pour ce code. Vérifiez le code avec le patient.'
          : 'Erreur lors de la recherche. Réessayez.';
      }
    });
  }

  goToDossier(): void {
    if (this.dossier) {
      this.router.navigate(['/dossier', this.dossier.codeSecret, 'donnees-personnelles']);
    }
  }

  getInitials(dp: DonneesPersonnelles): string {
    return `${dp?.prenom?.[0] || ''}${dp?.nom?.[0] || ''}`.toUpperCase();
  }

  calcAge(dateNaissance: string): number {
    const dob = new Date(dateNaissance);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  }

  trackByString(_index: number, value: string): string {
    return value;
  }
}