package com.sunass.regulatorio.controller;

import com.sunass.regulatorio.dto.DirectReportRequestDTO;
import com.sunass.regulatorio.dto.ReportRequestDTO;
import com.sunass.regulatorio.dto.ReportResponseDTO;
import com.sunass.regulatorio.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Informes", description = "Generación de informes técnicos con IA")
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/generate")
    @Operation(summary = "Generar informe desde una encuesta persistida (surveyId)")
    public ResponseEntity<ReportResponseDTO> generateReport(@Valid @RequestBody ReportRequestDTO request) {
        return ResponseEntity.ok(reportService.generateReport(request));
    }

    @PostMapping("/generate-direct")
    @Operation(summary = "Generar informe directo desde datos del frontend (sin encuesta persistida)")
    public ResponseEntity<ReportResponseDTO> generateDirectReport(@Valid @RequestBody DirectReportRequestDTO request) {
        return ResponseEntity.ok(reportService.generateDirectReport(request));
    }
}

