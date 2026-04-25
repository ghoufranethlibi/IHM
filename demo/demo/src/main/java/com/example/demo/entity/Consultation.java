package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date; // 📅 auto date

    @ManyToOne
    private DossierMedical dossier;

    @OneToOne(mappedBy = "consultation", cascade = CascadeType.ALL)
    private Diagnostic diagnostic;

    @OneToOne(mappedBy = "consultation", cascade = CascadeType.ALL)
    private Ordonnance ordonnance;
}