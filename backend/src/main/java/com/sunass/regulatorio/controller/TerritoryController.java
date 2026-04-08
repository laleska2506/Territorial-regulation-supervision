package com.sunass.regulatorio.controller;

import com.sunass.regulatorio.dto.DepartmentDTO;
import com.sunass.regulatorio.dto.DistrictDTO;
import com.sunass.regulatorio.dto.LocalityDTO;
import com.sunass.regulatorio.dto.ProvinceDTO;
import com.sunass.regulatorio.service.TerritoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/territory")
@RequiredArgsConstructor
@Tag(name = "Territory", description = "Gestión territorial: Departamentos, Provincias, Distritos, Localidades")
public class TerritoryController {

    private final TerritoryService territoryService;

    @GetMapping("/departments")
    @Operation(summary = "Listar todos los departamentos")
    public ResponseEntity<List<DepartmentDTO>> getDepartments() {
        return ResponseEntity.ok(territoryService.getDepartments());
    }

    @GetMapping("/departments/{departmentId}/provinces")
    @Operation(summary = "Listar provincias por departamento")
    public ResponseEntity<List<ProvinceDTO>> getProvincesByDepartment(@PathVariable UUID departmentId) {
        return ResponseEntity.ok(territoryService.getProvincesByDepartment(departmentId));
    }

    @GetMapping("/provinces")
    @Operation(summary = "Listar todas las provincias")
    public ResponseEntity<List<ProvinceDTO>> getAllProvinces() {
        return ResponseEntity.ok(territoryService.getAllProvinces());
    }

    @GetMapping("/provinces/{provinceId}/districts")
    @Operation(summary = "Listar distritos por provincia")
    public ResponseEntity<List<DistrictDTO>> getDistrictsByProvince(@PathVariable UUID provinceId) {
        return ResponseEntity.ok(territoryService.getDistrictsByProvince(provinceId));
    }

    @GetMapping("/districts/{districtId}/localities")
    @Operation(summary = "Listar localidades por distrito")
    public ResponseEntity<List<LocalityDTO>> getLocalitiesByDistrict(@PathVariable UUID districtId) {
        return ResponseEntity.ok(territoryService.getLocalitiesByDistrict(districtId));
    }
}
