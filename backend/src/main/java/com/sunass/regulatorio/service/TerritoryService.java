package com.sunass.regulatorio.service;

import com.sunass.regulatorio.domain.entity.*;
import com.sunass.regulatorio.dto.*;
import com.sunass.regulatorio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TerritoryService {

    private final DepartmentRepository departmentRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final LocalityRepository localityRepository;

    // ── Departments ──────────────────────────────────────────

    public List<DepartmentDTO> getDepartments() {
        return departmentRepository.findAllByOrderByNameAsc().stream()
                .map(d -> DepartmentDTO.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .build())
                .collect(Collectors.toList());
    }

    // ── Provinces ────────────────────────────────────────────

    public List<ProvinceDTO> getProvincesByDepartment(UUID departmentId) {
        return provinceRepository.findByDepartmentIdOrderByNameAsc(departmentId).stream()
                .map(this::toProvinceDTO)
                .collect(Collectors.toList());
    }

    public List<ProvinceDTO> getAllProvinces() {
        return provinceRepository.findAllByOrderByNameAsc().stream()
                .map(this::toProvinceDTO)
                .collect(Collectors.toList());
    }

    // ── Districts ────────────────────────────────────────────

    public List<DistrictDTO> getDistrictsByProvince(UUID provinceId) {
        return districtRepository.findByProvinceIdOrderByNameAsc(provinceId).stream()
                .map(d -> DistrictDTO.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .provinceId(d.getProvince().getId())
                        .build())
                .collect(Collectors.toList());
    }

    // ── Localities ───────────────────────────────────────────

    public List<LocalityDTO> getLocalitiesByDistrict(UUID districtId) {
        return localityRepository.findByDistrictIdOrderByNameAsc(districtId).stream()
                .map(this::toLocalityDTO)
                .collect(Collectors.toList());
    }

    // ── Mappers ──────────────────────────────────────────────

    private ProvinceDTO toProvinceDTO(Province p) {
        return ProvinceDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .departmentId(p.getDepartment().getId())
                .departmentName(p.getDepartment().getName())
                .build();
    }

    private LocalityDTO toLocalityDTO(Locality l) {
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
    }
}
