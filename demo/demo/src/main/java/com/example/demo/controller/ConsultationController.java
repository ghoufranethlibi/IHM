package com.example.demo.controller;

import com.example.demo.dto.ConsultationRequest;
import com.example.demo.dto.ConsultationResponse;
import com.example.demo.service.ConsultationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultation")
public class ConsultationController {

    private final ConsultationService service;

    public ConsultationController(ConsultationService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('MEDECIN')")
    @PostMapping("/{code}")
    public void addConsultation(@PathVariable String code,
                                @RequestBody ConsultationRequest request) {

        service.addConsultation(code, request);
    }
    @PreAuthorize("hasAnyRole('MEDECIN','INFIRMIER','AGENT')")
    @GetMapping("/{code}")
    public List<ConsultationResponse> getConsultations(@PathVariable String code) {
        return service.getConsultations(code);
    }
}