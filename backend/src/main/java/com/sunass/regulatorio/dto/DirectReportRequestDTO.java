package com.sunass.regulatorio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Map;

/**
 * DTO for generating a report directly from frontend data,
 * without requiring a persisted survey.
 */
@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DirectReportRequestDTO {

    @NotBlank(message = "El nombre del prestador es requerido")
    private String providerName;

    @NotBlank(message = "El tipo de prestador es requerido")
    private String providerType;

    private String location;

    @NotNull(message = "Las respuestas (answers) son requeridas")
    private Map<String, String> answers;

    private int photoCount;
}
