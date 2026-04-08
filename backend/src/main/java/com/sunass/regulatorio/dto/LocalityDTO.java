package com.sunass.regulatorio.dto;

import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LocalityDTO {
    private UUID id;
    private String ubigeo;
    private String name;
    private UUID provinceId;
    private String provinceName;
    private UUID districtId;
    private String districtName;
    private Double lat;
    private Double lng;
    private Integer population;
}
