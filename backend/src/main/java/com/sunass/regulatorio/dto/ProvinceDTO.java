package com.sunass.regulatorio.dto;

import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProvinceDTO {
    private UUID id;
    private String name;
    private UUID departmentId;
    private String departmentName;
}
