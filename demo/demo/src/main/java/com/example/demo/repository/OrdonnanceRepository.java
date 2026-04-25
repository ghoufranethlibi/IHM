package com.example.demo.repository;

import com.example.demo.entity.Ordonnance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Long> {
}