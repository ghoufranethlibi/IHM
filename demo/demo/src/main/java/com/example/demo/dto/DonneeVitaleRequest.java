package com.example.demo.dto;

import lombok.Data;

@Data
public class DonneeVitaleRequest {

    private Double temperature;
    private String tension;
    private Integer frequenceCardiaque;
}