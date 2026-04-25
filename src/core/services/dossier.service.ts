import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Consultation,
  DossierMedical,
  DonneesVitaux,
  ExamenMedical
} from '../../shared/models';
import { ApiCacheService } from './api-cache.service';

/**
 * REST client for medical records. Endpoint paths are conventional — align with your API.
 */
@Injectable({
  providedIn: 'root'
})
export class DossierService {
  private readonly dossierBase = `${environment.apiUrl}/dossier`;
  private readonly consultationBase = `${environment.apiUrl}/consultation`;
  private readonly vitalBase = `${environment.apiUrl}/vital`;
  private readonly examenBase = `${environment.apiUrl}/examen`;

  constructor(private readonly http: HttpClient, private readonly cache: ApiCacheService) {}

  getMyDossier(): Observable<DossierMedical> {
    return this.cache.getOrSet('dossier:me', () =>
      this.http.get<DossierMedical>(`${this.dossierBase}/me`)
    );
  }

  getFullDossier(codeSecret: string): Observable<DossierMedical> {
    return this.cache.getOrSet(`dossier:full:${codeSecret}`, () =>
      this.http.get<DossierMedical>(`${this.dossierBase}/full/${codeSecret}`)
    );
  }

  getConsultations(codeSecret: string): Observable<Consultation[]> {
    return this.cache.getOrSet(`consultations:${codeSecret}`, () =>
      this.http.get<Consultation[]>(`${this.consultationBase}/${codeSecret}`)
    );
  }

  addConsultation(codeSecret: string, payload: Partial<Consultation>): Observable<void> {
    return this.http.post<void>(`${this.consultationBase}/${codeSecret}`, {
      diagnosticTitre: payload.diagnosticTitre,
      diagnosticDescription: payload.diagnosticDescription,
      medicaments: payload.medicaments ?? []
    });
  }

  getDonneesVitales(codeSecret: string): Observable<DonneesVitaux[]> {
    return this.cache.getOrSet(`vitals:${codeSecret}`, () =>
      this.http.get<DonneesVitaux[]>(`${this.vitalBase}/${codeSecret}`)
    );
  }

  addDonneesVitaux(codeSecret: string, payload: Partial<DonneesVitaux>): Observable<void> {
    return this.http.post<void>(`${this.vitalBase}/${codeSecret}`, {
      temperature: payload.temperature,
      tension: payload.tension,
      frequenceCardiaque: payload.frequenceCardiaque
    });
  }

  getExamens(codeSecret: string): Observable<ExamenMedical[]> {
    return this.cache.getOrSet(`examens:${codeSecret}`, () =>
      this.http.get<ExamenMedical[]>(`${this.examenBase}/${codeSecret}`)
    );
  }

  addExamenMedical(codeSecret: string, payload: FormData): Observable<void> {
    return this.http.post<void>(`${this.examenBase}/${codeSecret}`, payload);
  }

  invalidateCodeCache(codeSecret: string): void {
    this.cache.invalidate(`dossier:full:${codeSecret}`);
    this.cache.invalidate(`consultations:${codeSecret}`);
    this.cache.invalidate(`vitals:${codeSecret}`);
    this.cache.invalidate(`examens:${codeSecret}`);
  }

  invalidateMyDossierCache(): void {
    this.cache.invalidate('dossier:me');
  }
}
