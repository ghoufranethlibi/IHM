package com.example.demo.controller;

import com.example.demo.dto.DossierResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.DossierMedical;
import com.example.demo.entity.Utilisateur;
import com.example.demo.service.UtilisateurService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    // 🔐 REGISTER
    @PostMapping({"/register", "/auth/register"})
    public LoginResponse.AuthUser register(@RequestBody RegisterRequest request) {
        Utilisateur user = service.registerEnabled(
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );
        return LoginResponse.toAuthUser(user);
    }

    // 👨‍💼 ADMIN - GET PENDING USERS
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/pending")
    public List<Utilisateur> getPendingUsers() {
        return service.getPendingUsers();
    }

    // 👨‍💼 ADMIN - APPROVE USER
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/approve/{id}")
    public void approveUser(@PathVariable Long id) {
        service.approveUser(id);
    }

    // 🔑 LOGIN
    @PostMapping({"/login", "/auth/login"})
    public LoginResponse login(@RequestBody LoginRequest request) {
        return service.login(request.getEmail(), request.getPassword());
    }
    @PreAuthorize("hasAnyRole('MEDECIN','INFIRMIER','AGENT')")
    @GetMapping("/dossier/{code}")
    public DossierResponse getDossier(@PathVariable String code) {
        return service.getDossierByCode(code);
    }
}