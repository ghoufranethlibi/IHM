package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class ConsultationService {

    private final PatientRepository patientRepo;
    private final DossierRepository dossierRepo;
    private final onsultationRepository consultationRepo;
    private final DiagnosticRepository diagnosticRepo;
    private final OrdonnanceRepository ordonnanceRepo;
    private final MedicamentRepository medicamentRepo;

    public ConsultationService(PatientRepository patientRepo,
                               DossierRepository dossierRepo,
                               onsultationRepository consultationRepo,
                               DiagnosticRepository diagnosticRepo,
                               OrdonnanceRepository ordonnanceRepo,
                               MedicamentRepository medicamentRepo) {
        this.patientRepo = patientRepo;
        this.dossierRepo = dossierRepo;
        this.consultationRepo = consultationRepo;
        this.diagnosticRepo = diagnosticRepo;
        this.ordonnanceRepo = ordonnanceRepo;
        this.medicamentRepo = medicamentRepo;
    }

    public void addConsultation(String code, ConsultationRequest request) {

        // 🔍 find patient
        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 📁 get dossier
        DossierMedical dossier = dossierRepo.findByPatient(patient);

        // 🩺 create consultation
        Consultation consultation = new Consultation();
        consultation.setDate(LocalDateTime.now());
        consultation.setDossier(dossier);

        consultationRepo.save(consultation);

        // 🧠 DIAGNOSTIC (optional)
        if (request.getDiagnosticTitre() != null) {

            Diagnostic diagnostic = new Diagnostic();
            diagnostic.setTitre(request.getDiagnosticTitre());
            diagnostic.setDescription(request.getDiagnosticDescription());
            diagnostic.setConsultation(consultation);

            diagnosticRepo.save(diagnostic);
        }

        // 💊 ORDONNANCE (optional)
        if (request.getMedicaments() != null && !request.getMedicaments().isEmpty()) {

            Ordonnance ordonnance = new Ordonnance();
            ordonnance.setConsultation(consultation);

            ordonnanceRepo.save(ordonnance);

            for (MedicamentRequest m : request.getMedicaments()) {

                Medicament med = new Medicament();
                med.setNom(m.getNom());
                med.setDosage(m.getDosage());
                med.setDuree(m.getDuree());
                med.setOrdonnance(ordonnance);

                medicamentRepo.save(med);
            }
        }
    }
    public List<ConsultationResponse> getConsultations(String code) {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        List<Consultation> consultations = consultationRepo.findByDossier(dossier);

        return consultations.stream().map(c -> {

            ConsultationResponse response = new ConsultationResponse();
            response.setDate(c.getDate());

            // 🧠 diagnostic
            if (c.getDiagnostic() != null) {
                response.setDiagnosticTitre(c.getDiagnostic().getTitre());
                response.setDiagnosticDescription(c.getDiagnostic().getDescription());
            }

            // 💊 medicaments
            if (c.getOrdonnance() != null) {
                List<MedicamentResponse> meds =
                        c.getOrdonnance().getMedicaments().stream().map(m -> {

                            MedicamentResponse mr = new MedicamentResponse();
                            mr.setNom(m.getNom());
                            mr.setDosage(m.getDosage());
                            mr.setDuree(m.getDuree());

                            return mr;
                        }).collect(Collectors.toList());

                response.setMedicaments(meds);
            }

            return response;

        }).collect(Collectors.toList());
    }
}