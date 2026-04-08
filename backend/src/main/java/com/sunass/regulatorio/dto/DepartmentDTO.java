package com.sunass.regulatorio.dto;

import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DepartmentDTO {
    private UUID id;
    private String name;
}
