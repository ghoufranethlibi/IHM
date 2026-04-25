package com.example.demo.repository;

import com.example.demo.entity.Patient;
import com.example.demo.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByCodeSecret(String code);
    Optional<Patient> findByUtilisateur(Utilisateur utilisateur);
}