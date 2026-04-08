package com.sunass.regulatorio.controller;

import com.sunass.regulatorio.domain.enums.PrestadorType;
import com.sunass.regulatorio.dto.PrestadorDTO;
import com.sunass.regulatorio.service.PrestadorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/prestadores")
@RequiredArgsConstructor
@Tag(name = "Prestadores", description = "Gestión de prestadores de servicios de saneamiento")
public class PrestadorController {

    private final PrestadorService prestadorService;

    @GetMapping
    @Operation(summary = "Listar prestadores con filtros opcionales")
    public ResponseEntity<List<PrestadorDTO>> getPrestadores(
            @RequestParam(required = false) PrestadorType type,
            @RequestParam(required = false) UUID localityId,
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(prestadorService.search(search));
        }
        if (districtId != null) {
            return ResponseEntity.ok(prestadorService.findByDistrictId(districtId));
        }
        if (localityId != null) {
            return ResponseEntity.ok(prestadorService.findByLocalityId(localityId));
        }
        if (type != null) {
            return ResponseEntity.ok(prestadorService.findByType(type));
        }
        return ResponseEntity.ok(prestadorService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener prestador por ID con localidades vinculadas")
    public ResponseEntity<PrestadorDTO> getPrestadorById(@PathVariable UUID id) {
        return ResponseEntity.ok(prestadorService.findById(id));
    }
}
