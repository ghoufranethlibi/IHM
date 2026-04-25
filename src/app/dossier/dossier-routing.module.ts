import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonneesPersonnellesComponent } from '../donnee-personnelles/donnee-personnelles.component';
import { VitauxComponent } from '../vitaux/vitaux.component';
import { ConsultationComponent } from '../consultation/consultation.component';
import { ExamenMedicalComponent } from '../examen-medical/examen-medical.component';

/**
 * All URLs are prefixed with `dossier` by the parent lazy route.
 * Static segments (no code) support the patient's own dossier; `:code` supports staff flow after search.
 */
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'donnees-personnelles' },
  { path: 'donnees-personnelles', component: DonneesPersonnellesComponent },
  { path: 'vitaux', component: VitauxComponent },
  { path: 'consultations', component: ConsultationComponent },
  { path: 'examens', component: ExamenMedicalComponent },
  {
    path: ':code',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'donnees-personnelles'
      },
      { path: 'donnees-personnelles', component: DonneesPersonnellesComponent },
      { path: 'vitaux', component: VitauxComponent },
      { path: 'consultations', component: ConsultationComponent },
      { path: 'examens', component: ExamenMedicalComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DossierRoutingModule {}
