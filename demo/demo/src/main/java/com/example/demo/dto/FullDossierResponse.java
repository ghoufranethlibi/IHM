package com.example.demo.dto;

import com.example.demo.entity.*;
import lombok.Data;

import java.util.List;

@Data
public class FullDossierResponse {
    private String codeSecret;
    private Long patientId;

    private DonneesPersonnelles donneesPersonnelles;

    private List<ConsultationResponse> consultations;

    private List<DonneeVitale> donneesVitales;

    private List<ExamenMedical> examens;
}