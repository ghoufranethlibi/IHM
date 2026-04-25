import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DossierRoutingModule } from './dossier-routing.module';
import { DonneesPersonnellesComponent } from '../donnee-personnelles/donnee-personnelles.component';
import { VitauxComponent } from '../vitaux/vitaux.component';
import { ConsultationComponent } from '../consultation/consultation.component';
import { ExamenMedicalComponent } from '../examen-medical/examen-medical.component';

/**
 * Feature module for dossier views (personal data, vitals, consultations, exams).
 */
@NgModule({
  declarations: [
    DonneesPersonnellesComponent,
    VitauxComponent,
    ConsultationComponent,
    ExamenMedicalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DossierRoutingModule
  ]
})
export class DossierModule {}
