package com.example.demo.repository;

import com.example.demo.entity.ExamenMedical;
import com.example.demo.entity.DossierMedical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamenMedicalRepository extends JpaRepository<ExamenMedical, Long> {

    List<ExamenMedical> findByDossier(DossierMedical dossier);
}