import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/auth/auth.service';
import { DossierService } from '../../core/services/dossier.service';
import { DossierMedical, Consultation } from '../../shared/models';
import { getRouteParam } from '../../core/routing/route-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-12px)' }),
        animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ConsultationComponent implements OnInit {
  dossier: DossierMedical | null = null;
  consultations: Consultation[] = [];
  consultForm!: FormGroup;
  showForm = false;
  submitting = false;
  successMsg = '';
  dossierCode = '';
  private readonly destroyRef = inject(DestroyRef);
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private dossierService: DossierService
  ) {}

  get canAdd(): boolean { return this.auth.hasRole('Admin', 'Medecin'); }

  ngOnInit(): void {
    this.consultForm = this.fb.group({
      diagnosticTitre: ['', Validators.required],
      diagnosticDescription: ['', Validators.required]
    });

    const dossierCode = getRouteParam(this.route, 'code');
    if (dossierCode) {
      this.dossierCode = dossierCode;
      this.dossierService.getFullDossier(dossierCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: DossierMedical) => {
        this.dossier = d;
      });
      this.dossierService.getConsultations(dossierCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((list: Consultation[]) => {
        this.consultations = list;
      });
    } else {
      this.dossierService.getMyDossier().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: DossierMedical) => {
        this.dossier = d;
        this.consultations = d.consultations || [];
      });
    }
  }

  submitConsultation(): void {
    if (!this.consultForm.valid || !this.dossier) return;
    this.submitting = true;

    const payload: Partial<Consultation> = { ...this.consultForm.value };
    this.dossierService.addConsultation(this.dossierCode, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.successMsg = 'Consultation enregistrée avec succès.';
        this.consultForm.reset();
        this.dossierService.invalidateCodeCache(this.dossierCode);
        this.dossierService.getConsultations(this.dossierCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((list: Consultation[]) => {
          this.consultations = list;
        });
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: () => { this.submitting = false; }
    });
  }

  goBack(): void { this.router.navigate(['/search']); }

  trackByConsultation(_index: number, consultation: Consultation): string {
    return `${consultation.date}-${consultation.diagnosticTitre}`;
  }
}