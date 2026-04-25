package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ConsultationResponse {

    private LocalDateTime date;

    private String diagnosticTitre;
    private String diagnosticDescription;

    private List<MedicamentResponse> medicaments;
}