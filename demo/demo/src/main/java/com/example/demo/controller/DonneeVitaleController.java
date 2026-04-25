package com.example.demo.controller;

import com.example.demo.dto.DonneeVitaleRequest;
import com.example.demo.entity.DonneeVitale;
import com.example.demo.service.DonneeVitaleService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vital")
public class DonneeVitaleController {

    private final DonneeVitaleService service;

    public DonneeVitaleController(DonneeVitaleService service) {
        this.service = service;
    }

    // ➕ ADD (ONLY INFIRMIER)
    @PreAuthorize("hasRole('INFIRMIER')")
    @PostMapping("/{code}")
    public void add(@PathVariable String code,
                    @RequestBody DonneeVitaleRequest request) {

        service.addDonneeVitale(code, request);
    }

    // 📥 GET
    @PreAuthorize("hasAnyRole('MEDECIN','INFIRMIER','AGENT')")
    @GetMapping("/{code}")
    public List<DonneeVitale> get(@PathVariable String code) {
        return service.getDonneesVitales(code);
    }
}