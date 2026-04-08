package com.sunass.regulatorio.service;

import com.sunass.regulatorio.domain.entity.*;
import com.sunass.regulatorio.domain.enums.PrestadorType;
import com.sunass.regulatorio.dto.*;
import com.sunass.regulatorio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PrestadorService {

    private final PrestadorRepository prestadorRepository;
    private final PrestadorLocalityRepository prestadorLocalityRepository;
    private final LocalityRepository localityRepository;

    public List<PrestadorDTO> findAll() {
        return prestadorRepository.findByIsActiveTrue().stream()
                .map(this::toPrestadorDTOSimple)
                .collect(Collectors.toList());
    }

    public PrestadorDTO findById(UUID id) {
        Prestador p = prestadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado: " + id));
        return toPrestadorDTOFull(p);
    }

    public List<PrestadorDTO> findByLocalityId(UUID localityId) {
        return prestadorRepository.findByLocalityId(localityId).stream()
                .map(this::toPrestadorDTOSimple)
                .collect(Collectors.toList());
    }

    public List<PrestadorDTO> findByDistrictId(UUID districtId) {
        return prestadorRepository.findByDistrictId(districtId).stream()
                .map(this::toPrestadorDTOSimple)
                .collect(Collectors.toList());
    }

    public List<PrestadorDTO> findByType(PrestadorType type) {
        return prestadorRepository.findByPrestadorType(type).stream()
                .map(this::toPrestadorDTOSimple)
                .collect(Collectors.toList());
    }

    public List<PrestadorDTO> search(String query) {
        return prestadorRepository.searchByName(query).stream()
                .map(this::toPrestadorDTOSimple)
                .collect(Collectors.toList());
    }

    /**
     * Simple DTO without loading linked localities (for list views).
     */
    private PrestadorDTO toPrestadorDTOSimple(Prestador p) {
        return PrestadorDTO.builder()
                .id(p.getId())
                .prestadorType(p.getPrestadorType())
                .name(p.getName())
                .code(p.getCode())
                .ruc(p.getRuc())
                .isActive(p.getIsActive())
                .localities(Collections.emptyList())
                .build();
    }

    /**
     * Full DTO with linked localities (for detail view).
     */
    private PrestadorDTO toPrestadorDTOFull(Prestador p) {
        List<PrestadorLocality> links = prestadorLocalityRepository.findByPrestadorId(p.getId());
        List<LocalityDTO> localities = links.stream()
                .map(pl -> {
                    Locality l = localityRepository.findById(pl.getLocalityId()).orElse(null);
                    if (l == null) return null;
                    return LocalityDTO.builder()
                            .id(l.getId())
                            .ubigeo(l.getUbigeo())
                            .name(l.getName())
                            .provinceId(l.getProvince().getId())
                            .provinceName(l.getProvince().getName())
                            .districtId(l.getDistrict().getId())
                            .districtName(l.getDistrict().getName())
                            .lat(l.getLat())
                            .lng(l.getLng())
                            .population(l.getPopulation())
                            .build();
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());

        return PrestadorDTO.builder()
                .id(p.getId())
                .prestadorType(p.getPrestadorType())
                .name(p.getName())
                .code(p.getCode())
                .ruc(p.getRuc())
                .isActive(p.getIsActive())
                .localities(localities)
                .build();
    }
}
