package com.sunass.regulatorio.dto;

import com.sunass.regulatorio.domain.enums.ModuleType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ReportRequestDTO {

    @NotNull
    private UUID surveyId;

    // Alternatively, provide data directly (used when report is generated at submission time)
    private UUID prestadorId;
    private ModuleType module;
    private Map<String, String> answers;
    private int photoCount;
}
