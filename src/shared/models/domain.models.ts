/** Domain types shared by dossier features and auth/session state. */

export type UserRole =
  | 'Admin'
  | 'Medecin'
  | 'Infirmier'
  | 'AgentMedical'
  | 'Patient';

export interface User {
  id: string;
  prenom: string;
  nom: string;
  role: UserRole;
  email?: string;
}

export interface DonneesPersonnelles {
  prenom: string;
  nom: string;
  dateNaissance: string;
  sexe: string;
  cin: string;
  telephone: string;
  adresse: string;
  groupeSanguin: string;
  mutuelle: string;
  medecinTraitant?: string;
  antecedents?: string;
  allergies?: string[];
  traitementsEnCours?: string;
}

export interface Consultation {
  date: string;
  diagnosticTitre: string;
  diagnosticDescription: string;
  medicaments?: Medicament[];
}

export interface DonneesVitaux {
  id?: string;
  tension: string;
  frequenceCardiaque: number;
  temperature: number;
  date?: string;
}

export interface Medicament {
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
}

export interface Analyse {
  type: string;
  laboratoire?: string;
  resultat?: string;
  statut: string;
  dateRealisation: string;
}

export interface Imagerie {
  type: string;
  region?: string;
  resultat?: string;
  statut: string;
  dateRealisation: string;
  radiologueNom?: string;
}

export interface ExamenMedical {
  id?: string;
  type: string;
  description: string;
  resultat: string;
  date: string;
  filePath?: string;
}

export interface DossierMedical {
  codeSecret: string;
  patientId?: string;
  donneesPersonnelles: DonneesPersonnelles;
  consultations?: Consultation[];
  donneesVitales?: DonneesVitaux[];
  examens?: ExamenMedical[];
}
