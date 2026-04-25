package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DossierService {

    private final UtilisateurRepository userRepo;
    private final PatientRepository patientRepo;
    private final DossierRepository dossierRepo;
    private final onsultationRepository consultationRepo;
    private final DonneeVitaleRepository vitaleRepo;
    private final ExamenMedicalRepository examenRepo;
    private final DonneesPersonnellesRepository dpRepo;

    public DossierService(UtilisateurRepository userRepo, PatientRepository patientRepo,
                          DossierRepository dossierRepo,
                          onsultationRepository consultationRepo,
                          DonneeVitaleRepository vitaleRepo,
                          ExamenMedicalRepository examenRepo,
                          DonneesPersonnellesRepository dpRepo) {
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
        this.dossierRepo = dossierRepo;
        this.consultationRepo = consultationRepo;
        this.vitaleRepo = vitaleRepo;
        this.examenRepo = examenRepo;
        this.dpRepo = dpRepo;
    }

    public FullDossierResponse getFullDossier(String code) {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        // 🧍 personal
        DonneesPersonnelles dp = dpRepo.findByDossier(dossier).orElse(null);

        // 🩺 consultations
        List<ConsultationResponse> consultations =
                consultationRepo.findByDossier(dossier)
                        .stream()
                        .map(c -> {
                            ConsultationResponse r = new ConsultationResponse();
                            r.setDate(c.getDate());

                            if (c.getDiagnostic() != null) {
                                r.setDiagnosticTitre(c.getDiagnostic().getTitre());
                                r.setDiagnosticDescription(c.getDiagnostic().getDescription());
                            }

                            if (c.getOrdonnance() != null) {
                                r.setMedicaments(
                                        c.getOrdonnance().getMedicaments().stream().map(m -> {
                                            MedicamentResponse mr = new MedicamentResponse();
                                            mr.setNom(m.getNom());
                                            mr.setDosage(m.getDosage());
                                            mr.setDuree(m.getDuree());
                                            return mr;
                                        }).collect(Collectors.toList())
                                );
                            }

                            return r;
                        }).collect(Collectors.toList());

        // ❤️ vital
        List<DonneeVitale> vitales = vitaleRepo.findByDossier(dossier);

        // 🧪 examens
        List<ExamenMedical> examens = examenRepo.findByDossier(dossier);

        // 📦 response
        FullDossierResponse response = new FullDossierResponse();
        response.setPatientId(patient.getId());
        response.setDonneesPersonnelles(dp);
        response.setConsultations(consultations);
        response.setDonneesVitales(vitales);
        response.setExamens(examens);
        response.setCodeSecret(patient.getCodeSecret());
        return response;
    }
    public FullDossierResponse getMyDossier(String email) {

        Utilisateur user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientRepo.findByUtilisateur(user)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        // 🧍 personal
        DonneesPersonnelles dp = dpRepo.findByDossier(dossier).orElse(null);

        // 🩺 consultations
        List<ConsultationResponse> consultations =
                consultationRepo.findByDossier(dossier)
                        .stream()
                        .map(c -> {
                            ConsultationResponse r = new ConsultationResponse();
                            r.setDate(c.getDate());

                            if (c.getDiagnostic() != null) {
                                r.setDiagnosticTitre(c.getDiagnostic().getTitre());
                                r.setDiagnosticDescription(c.getDiagnostic().getDescription());
                            }

                            if (c.getOrdonnance() != null) {
                                r.setMedicaments(
                                        c.getOrdonnance().getMedicaments().stream().map(m -> {
                                            MedicamentResponse mr = new MedicamentResponse();
                                            mr.setNom(m.getNom());
                                            mr.setDosage(m.getDosage());
                                            mr.setDuree(m.getDuree());
                                            return mr;
                                        }).toList()
                                );
                            }

                            return r;
                        }).toList();

        // ❤️ vital
        List<DonneeVitale> vitales = vitaleRepo.findByDossier(dossier);

        // 🧪 examens
        List<ExamenMedical> examens = examenRepo.findByDossier(dossier);

        FullDossierResponse response = new FullDossierResponse();
        response.setPatientId(patient.getId());
        response.setDonneesPersonnelles(dp);
        response.setConsultations(consultations);
        response.setDonneesVitales(vitales);
        response.setExamens(examens);
        response.setCodeSecret(patient.getCodeSecret());
        return response;
    }
}