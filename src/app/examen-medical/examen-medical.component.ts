import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/auth/auth.service';
import { DossierService } from '../../core/services/dossier.service';
import { DossierMedical, ExamenMedical } from '../../shared/models';
import { getRouteParam } from '../../core/routing/route-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-examen-medical',
  template: `
  <div class="dossier-page">
    <div class="page-header">
      <button class="btn-back" (click)="goBack()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Retour
      </button>
      <div class="page-header-info">
        <h1 class="page-title">Examens médicaux</h1>
        <div class="patient-tag" *ngIf="dossier">{{ dossier.donneesPersonnelles.prenom }} {{ dossier.donneesPersonnelles.nom }}</div>
      </div>
      <button class="btn-add-consult" *ngIf="canAdd" (click)="showForm = !showForm" style="background:#534ab7">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        Ajouter examen
      </button>
    </div>

    <div class="add-form-card" *ngIf="showForm && canAdd" @slideDown>
      <div class="form-card-header" style="background:#534ab7">
        <div class="form-card-title">Ajouter un examen médical</div>
        <div class="form-card-sub">{{ today | date:'dd/MM/yyyy' }} — {{ auth.currentUser?.email }}</div>
      </div>
      <div class="consult-form">
        <form [formGroup]="examenForm" (ngSubmit)="submitExamen()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Type d'examen *</label>
              <input formControlName="type" class="form-input" placeholder="Ex: Scanner, NFS, IRM..." />
            </div>
            <div class="form-group">
              <label class="form-label">Description *</label>
              <input formControlName="description" class="form-input" placeholder="Description de l'examen" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Résultat *</label>
            <textarea formControlName="resultat" class="form-textarea" rows="3" placeholder="Résultat de l'examen"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Fichier</label>
            <input type="file" (change)="onFileSelected($event)" class="form-input" />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="showForm = false">Annuler</button>
            <button type="submit" class="btn-submit" style="background:#534ab7" [disabled]="examenForm.invalid || submitting || !selectedFile">
              {{ submitting ? 'Enregistrement...' : 'Enregistrer l\'examen' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="success-bar" *ngIf="successMsg">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#0F6E56" stroke-width="1.2"/><path d="M5 8l2 2 4-4" stroke="#0F6E56" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      {{ successMsg }}
    </div>

    <ng-container *ngIf="examens.length > 0">
      <div class="examen-section-title">Examens médicaux</div>
      <div class="consultations-list">
        <div class="examen-row" *ngFor="let examen of examens; trackBy: trackByExamen">
          <div class="examen-icon-wrap" style="background:#EEEDFE; color:#3d348f">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="7" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M4 13l2.5-3h3L12 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          </div>
          <div class="examen-info">
            <div class="examen-name">{{ examen.type }}</div>
            <div class="examen-meta">{{ examen.date | date:'dd/MM/yyyy' }}</div>
            <div class="examen-result">{{ examen.description }}</div>
            <div class="examen-result" *ngIf="examen.resultat"><strong>Résultat:</strong> {{ examen.resultat }}</div>
          </div>
          <a class="statut-badge statut-prescrit" *ngIf="examen.filePath" [href]="examen.filePath" target="_blank" rel="noopener">Fichier</a>
        </div>
      </div>
    </ng-container>

    <div class="empty-state" *ngIf="examens.length === 0 && !showForm">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M14 5v14L9 30h22l-5-11V5" stroke="#ccc" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="24" r="4" stroke="#ccc" stroke-width="1.5"/></svg>
      <div class="empty-title">Aucun examen médical enregistré</div>
    </div>
  </div>
  `,
  styles: [`
    .examen-type-tabs { display:flex; gap:6px; margin-bottom:16px; }
    .tab-btn { padding:8px 16px; border:0.5px solid #e0ddd6; border-radius:8px; background:#fafaf8; font-size:13px; font-family:'DM Sans',sans-serif; color:#5F5E5A; cursor:pointer; transition:all .15s; }
    .tab-active { background:#0c1c2e; color:#fff; border-color:#0c1c2e; }
    .examen-row { display:flex; align-items:flex-start; gap:14px; background:#fff; border:0.5px solid #e8e6e0; border-radius:12px; padding:14px 18px; }
    .examen-icon-wrap { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .examen-name { font-size:13px; font-weight:500; color:#1a1a1a; }
    .examen-meta { font-size:11px; color:#aaa; margin-top:2px; }
    .examen-result { font-size:12px; color:#3C3C3A; margin-top:6px; line-height:1.5; }
    .examen-info { flex:1; }
    .statut-badge { font-size:11px; font-weight:500; padding:3px 10px; border-radius:10px; white-space:nowrap; flex-shrink:0; }
    .statut-prescrit { background:#EEEDFE; color:#3C3489; }
    .statut-enattente { background:#FAEEDA; color:#633806; }
    .statut-resultat { background:#E1F5EE; color:#085041; }
    .examen-section-title { font-size:13px; font-weight:600; color:#3C3C3A; text-transform:uppercase; letter-spacing:.04em; }
    .consultations-list { display:flex; flex-direction:column; gap:8px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideDown', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(-12px)' }), animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' }))])
    ])
  ]
})
export class ExamenMedicalComponent implements OnInit {
  dossier: DossierMedical | null = null;
  examens: ExamenMedical[] = [];
  examenForm!: FormGroup;
  showForm = false;
  submitting = false;
  successMsg = '';
  today = new Date();
  selectedFile: File | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, public auth: AuthService, private dossierService: DossierService) {}

  get canAdd(): boolean { return this.auth.hasRole('Admin', 'AgentMedical'); }

  ngOnInit(): void {
    this.examenForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      resultat: ['', Validators.required]
    });
    const code = getRouteParam(this.route, 'code');
    if (code) {
      this.dossierService.getFullDossier(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: DossierMedical) => {
        this.dossier = d;
      });
      this.dossierService.getExamens(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((list: ExamenMedical[]) => {
        this.examens = list;
      });
    } else {
      this.dossierService.getMyDossier().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: DossierMedical) => {
        this.dossier = d;
        this.examens = d.examens || [];
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  submitExamen(): void {
    if (!this.examenForm.valid || !this.dossier || !this.selectedFile) return;
    this.submitting = true;
    const vals = this.examenForm.value;
    const payload = new FormData();
    payload.append('type', vals.type);
    payload.append('description', vals.description);
    payload.append('resultat', vals.resultat);
    payload.append('file', this.selectedFile);

    this.dossierService.addExamenMedical(this.dossier.codeSecret, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.dossierService.invalidateCodeCache(this.dossier!.codeSecret);
        this.dossierService.getExamens(this.dossier!.codeSecret).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((list: ExamenMedical[]) => {
          this.examens = list;
        });
        this.submitting = false; this.showForm = false; this.selectedFile = null; this.successMsg = 'Examen enregistré avec succès.'; setTimeout(() => this.successMsg = '', 4000);
      },
      error: () => { this.submitting = false; }
    });
  }

  goBack(): void { this.router.navigate(['/search']); }

  trackByExamen(_index: number, examen: ExamenMedical): string {
    return `${examen.date}-${examen.type}-${examen.description}`;
  }
}