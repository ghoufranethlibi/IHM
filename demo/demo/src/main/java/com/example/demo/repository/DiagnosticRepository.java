package com.example.demo.repository;

import com.example.demo.entity.Diagnostic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiagnosticRepository extends JpaRepository<Diagnostic, Long> {
}