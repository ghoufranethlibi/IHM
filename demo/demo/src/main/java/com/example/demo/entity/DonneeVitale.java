package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonneeVitale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double temperature;
    private String tension;
    private Integer frequenceCardiaque;

    private LocalDateTime date; // 📅 important

    @ManyToOne
    private DossierMedical dossier;
}