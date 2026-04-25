package com.example.demo.controller;
import org.springframework.security.core.Authentication;
import com.example.demo.dto.FullDossierResponse;
import com.example.demo.service.DossierService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dossier")
public class DossierController {

    private final DossierService service;

    // ✅ Constructor injection
    public DossierController(DossierService service) {
        this.service = service;
    }

    // 🔍 GET FULL DOSSIER BY SECRET CODE
    @PreAuthorize("hasAnyRole('MEDECIN','INFIRMIER','AGENT')")
    @GetMapping("/full/{code}")
    public FullDossierResponse getFullDossier(@PathVariable String code) {

        return service.getFullDossier(code);
    }
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/me")
    public FullDossierResponse getMyDossier(Authentication authentication) {

        String email = authentication.getName(); // from JWT

        return service.getMyDossier(email);
    }
}