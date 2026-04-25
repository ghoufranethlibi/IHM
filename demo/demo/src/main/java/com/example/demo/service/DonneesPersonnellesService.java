package com.example.demo.service;

import com.example.demo.dto.DonneesPersonnellesRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;

@Service
public class DonneesPersonnellesService {

    private final PatientRepository patientRepo;
    private final DossierRepository dossierRepo;
    private final DonneesPersonnellesRepository dpRepo;

    public DonneesPersonnellesService(PatientRepository patientRepo,
                                      DossierRepository dossierRepo,
                                      DonneesPersonnellesRepository dpRepo) {
        this.patientRepo = patientRepo;
        this.dossierRepo = dossierRepo;
        this.dpRepo = dpRepo;
    }

    // ➕ CREATE OR UPDATE
    public void save(String code, DonneesPersonnellesRequest request) {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        DonneesPersonnelles dp = dpRepo.findByDossier(dossier)
                .orElse(new DonneesPersonnelles());

        dp.setNom(request.getNom());
        dp.setPrenom(request.getPrenom());
        dp.setAge(request.getAge());
        dp.setGroupeSanguin(request.getGroupeSanguin());
        dp.setAllergies(request.getAllergies());
        dp.setAntecedents(request.getAntecedents());
        dp.setDossier(dossier);

        dpRepo.save(dp);
    }

    // 📥 GET
    public DonneesPersonnelles get(String code) {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        return dpRepo.findByDossier(dossier)
                .orElseThrow(() -> new RuntimeException("No data found"));
    }
}