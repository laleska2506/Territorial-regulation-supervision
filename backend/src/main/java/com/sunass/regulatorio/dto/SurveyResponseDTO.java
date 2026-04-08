package com.sunass.regulatorio.dto;

import com.sunass.regulatorio.domain.enums.ModuleType;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SurveyResponseDTO {
    private UUID id;
    private UUID visitId;
    private UUID prestadorId;
    private String prestadorName;
    private UUID localityId;
    private String localityName;
    private ModuleType module;
    private Integer version;
    private Map<String, Object> payload;
    private OffsetDateTime answeredAt;
    private long evidenceCount;
    private String reportSummary;
}
