package com.example.demo.repository;

import com.example.demo.entity.DonneesPersonnelles;
import com.example.demo.entity.DossierMedical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonneesPersonnellesRepository extends JpaRepository<DonneesPersonnelles, Long> {

    Optional<DonneesPersonnelles> findByDossier(DossierMedical dossier);
}