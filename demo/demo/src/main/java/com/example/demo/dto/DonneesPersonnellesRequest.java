package com.example.demo.dto;

import lombok.Data;

@Data
public class DonneesPersonnellesRequest {

    private String nom;
    private String prenom;
    private Integer age;
    private String groupeSanguin;
    private String allergies;
    private String antecedents;
}