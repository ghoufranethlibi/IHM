package com.example.demo.repository;

import com.example.demo.entity.DossierMedical;
import com.example.demo.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DossierRepository extends JpaRepository<DossierMedical, Long> {
    DossierMedical findByPatient(Patient patient);
}