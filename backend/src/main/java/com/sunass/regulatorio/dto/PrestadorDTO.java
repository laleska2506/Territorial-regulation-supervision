package com.sunass.regulatorio.dto;

import com.sunass.regulatorio.domain.enums.PrestadorType;
import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PrestadorDTO {
    private UUID id;
    private PrestadorType prestadorType;
    private String name;
    private String code;
    private String ruc;
    private Boolean isActive;
    private List<LocalityDTO> localities;
}
