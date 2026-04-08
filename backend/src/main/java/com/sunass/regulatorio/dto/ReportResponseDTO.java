package com.sunass.regulatorio.dto;

import lombok.*;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ReportResponseDTO {
    private String reportMarkdown;
    private String surveyId;
    private String prestadorName;
    private String module;
}
