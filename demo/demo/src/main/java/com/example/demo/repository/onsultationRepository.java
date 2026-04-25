package com.example.demo.repository;

import com.example.demo.entity.Consultation;
import com.example.demo.entity.DossierMedical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface onsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByDossier(DossierMedical dossier);
}