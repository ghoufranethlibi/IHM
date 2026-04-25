package com.example.demo.service;

import com.example.demo.dto.ExamenRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExamenMedicalService {

    private final PatientRepository patientRepo;
    private final DossierRepository dossierRepo;
    private final ExamenMedicalRepository examenRepo;

    public ExamenMedicalService(PatientRepository patientRepo,
                                DossierRepository dossierRepo,
                                ExamenMedicalRepository examenRepo) {
        this.patientRepo = patientRepo;
        this.dossierRepo = dossierRepo;
        this.examenRepo = examenRepo;
    }

    // ➕ ADD
    public void addExamen(String code,
                          String type,
                          String description,
                          String resultat,
                          MultipartFile file) throws Exception {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        // 📁 save file
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads/" + fileName);

        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        // 🧪 save examen
        ExamenMedical examen = new ExamenMedical();
        examen.setType(type);
        examen.setDescription(description);
        examen.setResultat(resultat);
        examen.setDate(LocalDateTime.now());
        examen.setFilePath(path.toString());
        examen.setDossier(dossier);

        examenRepo.save(examen);
    }

    // 📥 GET
    public List<ExamenMedical> getExamens(String code) {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        return examenRepo.findByDossier(dossier);
    }
}