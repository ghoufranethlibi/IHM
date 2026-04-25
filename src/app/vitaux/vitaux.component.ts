import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/auth/auth.service';
import { DossierService } from '../../core/services/dossier.service';
import { DossierMedical, DonneesVitaux } from '../../shared/models';
import { getRouteParam } from '../../core/routing/route-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-vitaux',
  template: `
  <div class="dossier-page">
    <div class="page-header">
      <button class="btn-back" (click)="goBack()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Retour
      </button>
      <div class="page-header-info">
        <h1 class="page-title">Données vitaux</h1>
        <div class="patient-tag" *ngIf="dossier">{{ dossier.donneesPersonnelles.prenom }} {{ dossier.donneesPersonnelles.nom }}</div>
      </div>
      <button class="btn-add-consult" *ngIf="canAdd" (click)="showForm = !showForm" style="background:#534ab7">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        Saisir vitaux
      </button>
    </div>

    <div class="add-form-card" *ngIf="showForm && canAdd" @slideDown>
      <div class="form-card-header" style="background:#534ab7">
        <div class="form-card-title">Nouveau relevé de données vitaux</div>
        <div class="form-card-sub">{{ today | date:'dd/MM/yyyy HH:mm' }} — Inf. {{ auth.currentUser?.email }}</div>
      </div>
      <form [formGroup]="vitauxForm" (ngSubmit)="submitVitaux()" class="consult-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tension artérielle (ex: 120/80)</label>
            <input formControlName="tension" class="form-input" placeholder="120/80" />
          </div>
          <div class="form-group">
            <label class="form-label">Fréquence cardiaque (bpm)</label>
            <input formControlName="frequenceCardiaque" type="number" class="form-input" placeholder="72" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Température (°C)</label>
          <input formControlName="temperature" type="number" step="0.1" class="form-input" placeholder="37.0" />
        </div>
        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="showForm = false">Annuler</button>
          <button type="submit" class="btn-submit" style="background:#534ab7" [disabled]="vitauxForm.invalid || submitting">
            {{ submitting ? 'Enregistrement...' : 'Enregistrer les vitaux' }}
          </button>
        </div>
      </form>
    </div>

    <div class="success-bar" *ngIf="successMsg">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#0F6E56" stroke-width="1.2"/><path d="M5 8l2 2 4-4" stroke="#0F6E56" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      {{ successMsg }}
    </div>

    <div class="consultations-list">
      <div class="vitaux-card" *ngFor="let v of vitauxList; trackBy: trackByVital">
        <div class="consult-card-header">
          <div class="consult-date-badge" style="background:#EEEDFE;color:#3d348f">{{ v.date | date:'dd/MM/yyyy HH:mm' }}</div>
          <div class="consult-doctor" style="color:#534ab7">Données vitales</div>
        </div>
        <div class="vitaux-grid-display">
          <div class="vitaux-chip"><div class="vc-label">Tension</div><div class="vc-val">{{ v.tension }} <span class="vc-unit">mmHg</span></div></div>
          <div class="vitaux-chip"><div class="vc-label">Fréq. cardiaque</div><div class="vc-val">{{ v.frequenceCardiaque }} <span class="vc-unit">bpm</span></div></div>
          <div class="vitaux-chip" [class.chip-warn]="v.temperature > 37.5"><div class="vc-label">Température</div><div class="vc-val">{{ v.temperature }} <span class="vc-unit">°C</span></div></div>
        </div>
      </div>
    </div>

    <div class="empty-state" *ngIf="vitauxList.length === 0 && !showForm">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M5 20h7l4.5-12 7 22 5.5-15 4 8H36" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="empty-title">Aucune donnée vitaux enregistrée</div>
      <div class="empty-sub" *ngIf="canAdd">Cliquez sur "Saisir vitaux" pour commencer.</div>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .vitaux-card { background:#fff; border:0.5px solid #e8e6e0; border-radius:14px; overflow:hidden; }
    .vitaux-grid-display { display:grid; grid-template-columns:repeat(3,1fr); gap:0; }
    .vitaux-chip { padding:14px 18px; border-right:0.5px solid #f0ede8; border-bottom:0.5px solid #f0ede8; }
    .vitaux-chip:nth-child(3n) { border-right:none; }
    .vitaux-chip:nth-last-child(-n+3) { border-bottom:none; }
    .chip-warn .vc-val { color:#854F0B; }
    .vc-label { font-size:10px; color:#aaa; text-transform:uppercase; letter-spacing:.05em; margin-bottom:4px; }
    .vc-val { font-size:20px; font-weight:600; color:#1a1a1a; }
    .vc-unit { font-size:11px; color:#888780; font-weight:400; }
  `],
  animations: [
    trigger('slideDown', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(-12px)' }), animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' }))])
    ])
  ]
})
export class VitauxComponent implements OnInit {
  dossier: DossierMedical | null = null;
  vitauxList: DonneesVitaux[] = [];
  vitauxForm!: FormGroup;
  showForm = false;
  submitting = false;
  successMsg = '';
  today = new Date();
  private readonly destroyRef = inject(DestroyRef);

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, public auth: AuthService, private dossierService: DossierService) {}

  get canAdd(): boolean { return this.auth.hasRole('Admin', 'Infirmier'); }

  ngOnInit(): void {
    this.vitauxForm = this.fb.group({
      tension: ['', Validators.required],
      frequenceCardiaque: ['', [Validators.required, Validators.min(1)]],
      temperature: ['', [Validators.required, Validators.min(30)]]
    });
    const code = getRouteParam(this.route, 'code');
    if (code) {
      this.dossierService.getFullDossier(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: DossierMedical) => {
        this.dossier = d;
      });
      this.dossierService.getDonneesVitales(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((list: DonneesVitaux[]) => {
        this.vitauxList = list;
      });
    } else {
      this.dossierService.getMyDossier().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: DossierMedical) => {
        this.dossier = d;
        this.vitauxList = d.donneesVitales || [];
      });
    }
  }

  submitVitaux(): void {
    if (!this.vitauxForm.valid || !this.dossier) return;
    this.submitting = true;
    const payload: Partial<DonneesVitaux> = { ...this.vitauxForm.value };
    this.dossierService.addDonneesVitaux(this.dossier.codeSecret, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.dossierService.invalidateCodeCache(this.dossier!.codeSecret);
        this.dossierService.getDonneesVitales(this.dossier!.codeSecret).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((list: DonneesVitaux[]) => {
          this.vitauxList = list;
        });
        this.submitting = false; this.showForm = false; this.successMsg = 'Données vitaux enregistrées.'; setTimeout(() => this.successMsg = '', 4000);
      },
      error: () => { this.submitting = false; }
    });
  }

  goBack(): void { this.router.navigate(['/search']); }

  trackByVital(_index: number, vital: DonneesVitaux): string {
    return `${vital.date ?? ''}-${vital.tension}-${vital.frequenceCardiaque}`;
  }
}