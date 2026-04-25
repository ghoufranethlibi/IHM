package com.example.demo.repository;

import com.example.demo.entity.DonneeVitale;
import com.example.demo.entity.DossierMedical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonneeVitaleRepository extends JpaRepository<DonneeVitale, Long> {

    List<DonneeVitale> findByDossier(DossierMedical dossier);
}