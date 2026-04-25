package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;

    private Boolean enabled;

    private String registrationNumber; // 🔥 NEW (for doctor, nurse...)

    @ManyToOne
    private Role role; // 🔥 ONE ROLE
}