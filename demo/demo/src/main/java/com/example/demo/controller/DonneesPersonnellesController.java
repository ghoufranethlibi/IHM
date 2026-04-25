package com.example.demo.controller;

import com.example.demo.dto.DonneesPersonnellesRequest;
import com.example.demo.entity.DonneesPersonnelles;
import com.example.demo.service.DonneesPersonnellesService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/personal")
public class DonneesPersonnellesController {

    private final DonneesPersonnellesService service;

    public DonneesPersonnellesController(DonneesPersonnellesService service) {
        this.service = service;
    }

    // ➕ ONLY PATIENT
    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping("/{code}")
    public void save(@PathVariable String code,
                     @RequestBody DonneesPersonnellesRequest request) {
        service.save(code, request);
    }

    // 📥 VIEW
    @PreAuthorize("hasAnyRole('MEDECIN','INFIRMIER','AGENT','PATIENT')")
    @GetMapping("/{code}")
    public DonneesPersonnelles get(@PathVariable String code) {
        return service.get(code);
    }
}