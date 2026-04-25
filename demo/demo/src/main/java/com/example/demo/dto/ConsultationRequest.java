package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class ConsultationRequest {

    private String diagnosticTitre;
    private String diagnosticDescription;

    private List<MedicamentRequest> medicaments;
}