package com.example.demo.service;

import com.example.demo.dto.DossierResponse;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UtilisateurService {

    private final JwtUtil jwtUtil;
    private final UtilisateurRepository userRepo;
    private final RoleRepository roleRepo;
    private final PatientRepository patientRepo;
    private final DossierRepository dossierRepo;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository userRepo,
                              RoleRepository roleRepo,
                              JwtUtil jwtUtil,
                              PatientRepository patientRepo,
                              DossierRepository dossierRepo,
                              PasswordEncoder passwordEncoder) {

        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.jwtUtil = jwtUtil;
        this.patientRepo = patientRepo;
        this.dossierRepo = dossierRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // 🔐 REGISTER
    public Utilisateur register(String email, String password, String roleName, String registrationNumber) {
        Role role = resolveRole(roleName);

        Utilisateur user = new Utilisateur();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        if (roleName.equals("ROLE_PATIENT")) {
            user.setEnabled(true);
        } else {
            user.setEnabled(false);
            user.setRegistrationNumber(registrationNumber);
        }

        // ✅ SAVE USER FIRST
        Utilisateur savedUser = userRepo.save(user);

        // ✅ CREATE PATIENT + DOSSIER
        if (roleName.equals("ROLE_PATIENT")) {

            Patient patient = new Patient();
            patient.setUtilisateur(savedUser);

            String code;

            do {
                code = String.valueOf((int)(Math.random() * 900000) + 100000);
            } while (patientRepo.findByCodeSecret(code).isPresent());
            patient.setCodeSecret(code);

            patientRepo.save(patient);

            DossierMedical dossier = new DossierMedical();
            dossier.setPatient(patient);

            dossierRepo.save(dossier);
        }

        return savedUser;
    }

    public Utilisateur registerEnabled(String email, String password, String roleName) {
        Role role = resolveRole(roleName);

        Utilisateur user = new Utilisateur();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEnabled(true);
        user.setRegistrationNumber(null);

        return userRepo.save(user);
    }

    // 🔑 LOGIN
    public LoginResponse login(String email, String password) {

        Utilisateur user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.FALSE.equals(user.getEnabled())) {
            throw new RuntimeException("Account not approved");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return LoginResponse.from(user, jwtUtil.generateToken(user), jwtUtil.getExpirationSeconds());
    }

    private Role resolveRole(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            throw new RuntimeException("Role not found");
        }

        String raw = roleName.trim();
        String upper = raw.toUpperCase();
        String prefixed = upper.startsWith("ROLE_") ? upper : "ROLE_" + upper;
        String unprefixed = upper.startsWith("ROLE_") ? upper.substring(5) : upper;

        return roleRepo.findByName(raw)
                .or(() -> roleRepo.findByName(upper))
                .or(() -> roleRepo.findByName(prefixed))
                .or(() -> roleRepo.findByName(unprefixed))
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(prefixed);
                    return roleRepo.save(role);
                });
    }

    // 👨‍💼 GET PENDING USERS (🔥 THIS WAS MISSING)
    public List<Utilisateur> getPendingUsers() {
        return userRepo.findByEnabledFalse();
    }

    // 👨‍💼 APPROVE USER (🔥 THIS WAS MISSING)
    public void approveUser(Long id) {

        Utilisateur user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);

        userRepo.save(user);
    }
    public DossierResponse getDossierByCode(String code) {

        Patient patient = patientRepo.findByCodeSecret(code)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DossierMedical dossier = dossierRepo.findByPatient(patient);

        DossierResponse response = new DossierResponse();
        response.setDossierId(dossier.getId());
        response.setPatientId(patient.getId());

        return response;
    }
}