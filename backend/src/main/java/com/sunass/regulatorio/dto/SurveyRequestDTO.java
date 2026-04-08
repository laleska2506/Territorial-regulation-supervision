package com.sunass.regulatorio.dto;

import com.sunass.regulatorio.domain.enums.ModuleType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SurveyRequestDTO {

    @NotNull(message = "prestadorId es requerido")
    private UUID prestadorId;

    @NotNull(message = "localityId es requerido")
    private UUID localityId;

    @NotNull(message = "module es requerido")
    private ModuleType module;

    /**
     * Checklist answers: key = questionId, value = "SI" | "NO"
     */
    @NotNull(message = "Las respuestas (answers) son requeridas")
    private Map<String, String> answers;

    // Optional geolocation
    private Double lat;
    private Double lng;
    private Double accuracyM;

    private String notes;
}
