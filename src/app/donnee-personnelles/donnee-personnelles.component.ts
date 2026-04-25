import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DossierService } from '../../core/services/dossier.service';
import { DossierMedical } from '../../shared/models';
import { getRouteParam } from '../../core/routing/route-utils';
import * as QRCode from 'qrcode';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-donnees-personnelles',
  template: `
  <div class="dossier-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">Données personnelles</h1>
        <div class="patient-tag" *ngIf="dossier">Code dossier: {{ dossier.codeSecret }}</div>
      </div>
      <div class="code-secret-display" *ngIf="isPatient && dossier">
        <div style="font-size:11px;color:#888780;margin-bottom:3px">Votre code patient (QR)</div>
        <img *ngIf="qrCodeDataUrl" [src]="qrCodeDataUrl" alt="Code QR patient" class="qr-image" />
        <div style="font-family:monospace;font-size:14px;font-weight:600;color:#534AB7;letter-spacing:.08em">{{ dossier.codeSecret }}</div>
        <div style="font-size:10px;color:#aaa;margin-top:3px">Présentez ce QR code au personnel médical.</div>
      </div>
    </div>

    <div class="loading-state" *ngIf="loading">Chargement du dossier...</div>

    <ng-container *ngIf="dossier && !loading">
      <!-- INFOS PATIENT -->
      <div class="info-grid">
        <div class="info-card">
          <div class="info-card-header">
            <div class="info-card-dot" style="background:#534AB7"></div>
            <div class="info-card-title">Informations générales</div>
          </div>
          <div class="info-rows">
            <div class="info-row"><span class="info-key">Nom complet</span><span class="info-val">{{ dp.prenom }} {{ dp.nom }}</span></div>
            <div class="info-row"><span class="info-key">Date de naissance</span><span class="info-val">{{ dp.dateNaissance | date:'dd/MM/yyyy' }}</span></div>
            <div class="info-row"><span class="info-key">Sexe</span><span class="info-val">{{ dp.sexe }}</span></div>
            <div class="info-row"><span class="info-key">CIN</span><span class="info-val">{{ dp.cin }}</span></div>
            <div class="info-row"><span class="info-key">Téléphone</span><span class="info-val">{{ dp.telephone }}</span></div>
            <div class="info-row"><span class="info-key">Adresse</span><span class="info-val">{{ dp.adresse }}</span></div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-card-header">
            <div class="info-card-dot" style="background:#185FA5"></div>
            <div class="info-card-title">Informations médicales</div>
          </div>
          <div class="info-rows">
            <div class="info-row"><span class="info-key">Groupe sanguin</span><span class="info-val blood-type">{{ dp.groupeSanguin }}</span></div>
            <div class="info-row"><span class="info-key">Mutuelle</span><span class="info-val">{{ dp.mutuelle }}</span></div>
            <div class="info-row"><span class="info-key">Médecin traitant</span><span class="info-val">{{ dp.medecinTraitant || 'Non renseigné' }}</span></div>
          </div>
        </div>
      </div>

      <div class="info-card full">
        <div class="info-card-header">
          <div class="info-card-dot" style="background:#854F0B"></div>
          <div class="info-card-title">Antécédents, allergies & traitements</div>
        </div>
        <div class="triples-grid">
          <div>
            <div class="triple-label">Antécédents médicaux</div>
            <div class="triple-val">{{ dp.antecedents || 'Aucun renseigné' }}</div>
          </div>
          <div>
            <div class="triple-label">Allergies connues</div>
            <div class="allergies-wrap">
              <span class="allergy-tag" *ngFor="let a of dp.allergies; trackBy: trackByAllergy">{{ a }}</span>
              <span class="triple-val" *ngIf="!dp.allergies?.length">Aucune allergie connue</span>
            </div>
          </div>
          <div>
            <div class="triple-label">Traitements en cours</div>
            <div class="triple-val">{{ dp.traitementsEnCours || 'Aucun traitement en cours' }}</div>
          </div>
        </div>
      </div>
    </ng-container>
  </div>
  `,
  styles: [`
    .dossier-page { padding: 16px; width: 100%; font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 14px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; }
    .page-title { font-family: 'DM Serif Display', serif; font-size: 24px; color: #1a1a1a; }
    .patient-tag { font-size: 12px; color: #888780; margin-top: 4px; }
    .code-secret-display { background: #EEEDFE; border: 0.5px solid #CECBF6; border-radius: 12px; padding: 14px 20px; text-align: center; }
    .qr-image { width: 108px; height: 108px; display: block; margin: 6px auto; }
    .loading-state { padding: 40px; text-align: center; color: #888780; font-size: 14px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .info-card { background: #fff; border: 0.5px solid #e8e6e0; border-radius: 14px; overflow: hidden; }
    .info-card.full { grid-column: 1 / -1; }
    .info-card-header { display: flex; align-items: center; gap: 8px; padding: 14px 18px; border-bottom: 0.5px solid #f0ede8; }
    .info-card-dot { width: 8px; height: 8px; border-radius: 50%; }
    .info-card-title { font-size: 13px; font-weight: 500; color: #1a1a1a; }
    .info-rows { padding: 4px 0; }
    .info-row { display: flex; align-items: center; padding: 10px 18px; border-bottom: 0.5px solid #f8f7f4; }
    .info-row:last-child { border-bottom: none; }
    .info-key { font-size: 12px; color: #888780; width: 160px; flex-shrink: 0; }
    .info-val { font-size: 13px; color: #1a1a1a; font-weight: 500; }
    .blood-type { color: #A32D2D; font-weight: 600; }
    .triples-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; padding: 18px; }
    .triple-label { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #aaa; font-weight: 500; margin-bottom: 6px; }
    .triple-val { font-size: 13px; color: #3C3C3A; line-height: 1.5; }
    .allergies-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
    .allergy-tag { background: #FCEBEB; color: #791F1F; font-size: 11px; font-weight: 500; padding: 2px 10px; border-radius: 12px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonneesPersonnellesComponent implements OnInit {
  dossier: DossierMedical | null = null;
  loading = true;
  qrCodeDataUrl = '';
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private dossierService: DossierService
  ) {}

  get dp() { return this.dossier!.donneesPersonnelles; }
  get isPatient(): boolean { return this.auth.hasRole('Patient'); }

  ngOnInit(): void {
    const code = getRouteParam(this.route, 'code');
    if (code) {
      this.dossierService.getFullDossier(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: DossierMedical) => {
        this.setDossier(d);
      });
    } else {
      this.dossierService.getMyDossier().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((d: DossierMedical) => {
        this.setDossier(d);
      });
    }
  }

  private setDossier(dossier: DossierMedical): void {
    this.dossier = dossier;
    this.loading = false;
    if (dossier.codeSecret) {
      QRCode.toDataURL(dossier.codeSecret, { margin: 1, width: 180 })
        .then((url: string) => this.qrCodeDataUrl = url)
        .catch(() => this.qrCodeDataUrl = '');
    }
  }

  trackByAllergy(_index: number, allergy: string): string {
    return allergy;
  }
}