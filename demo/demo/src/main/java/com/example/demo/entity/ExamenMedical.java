package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamenMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String description;
    private String resultat;

    private LocalDateTime date;

    @Column(length = 500)
    private String filePath; // 🔥 NEW

    @ManyToOne
    private DossierMedical dossier;
}