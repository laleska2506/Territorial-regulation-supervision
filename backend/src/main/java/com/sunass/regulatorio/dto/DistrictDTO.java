package com.sunass.regulatorio.dto;

import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DistrictDTO {
    private UUID id;
    private String name;
    private UUID provinceId;
}
