package com.example.demo.service;

import com.example.demo.dto.DonneeVitaleRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonneeVitaleService {

    private final PatientRepository patientRepo;
    private final DossierRepository dossierRepo;
    private final DonneeVitaleRepository vitaleRepo;

    public DonneeVitaleService(PatientRepository patientRepo,
                               DossierRepository dossierRepo,
                               DonneeVitaleRepository vitaleRepo) {
        this.patientRepo = patientRepo;
        this.dossierRepo = dossierRepo;
        this.vitaleRepo = vitaleRepo;
    }

    // ➕ ADD DATA
    public void addDonneeVitale(String code, DonneeVitaleRequest request) {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        DonneeVitale dv = new DonneeVitale();
        dv.setTemperature(request.getTemperature());
        dv.setTension(request.getTension());
        dv.setFrequenceCardiaque(request.getFrequenceCardiaque());
        dv.setDate(LocalDateTime.now());
        dv.setDossier(dossier);

        vitaleRepo.save(dv);
    }

    // 📥 GET DATA
    public List<DonneeVitale> getDonneesVitales(String code) {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        return vitaleRepo.findByDossier(dossier);
    }
}