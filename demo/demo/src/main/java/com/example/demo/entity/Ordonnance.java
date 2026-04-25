package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ordonnance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Consultation consultation;

    @OneToMany(mappedBy = "ordonnance", cascade = CascadeType.ALL)
    private List<Medicament> medicaments;
}