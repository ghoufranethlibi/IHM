package com.example.demo.controller;

import com.example.demo.dto.ExamenRequest;
import com.example.demo.entity.ExamenMedical;
import com.example.demo.service.ExamenMedicalService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/examen")
public class ExamenMedicalController {

    private final ExamenMedicalService service;

    public ExamenMedicalController(ExamenMedicalService service) {
        this.service = service;
    }

    // ➕ ONLY AGENT
    @PreAuthorize("hasRole('AGENT')")
    @PostMapping(value = "/{code}", consumes = "multipart/form-data")
    public void add(@PathVariable String code,
                    @RequestParam String type,
                    @RequestParam String description,
                    @RequestParam String resultat,
                    @RequestParam MultipartFile file) throws Exception {

        service.addExamen(code, type, description, resultat, file);
    }

    // 📥 VIEW
    @PreAuthorize("hasAnyRole('MEDECIN','INFIRMIER','AGENT')")
    @GetMapping("/{code}")
    public List<ExamenMedical> get(@PathVariable String code) {
        return service.getExamens(code);
    }
}