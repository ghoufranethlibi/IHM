package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonneesPersonnelles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private Integer age;
    private String groupeSanguin;
    private String allergies;
    private String antecedents;

    @OneToOne
    private DossierMedical dossier;
}