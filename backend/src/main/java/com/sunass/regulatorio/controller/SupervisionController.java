package com.sunass.regulatorio.controller;

import com.sunass.regulatorio.domain.entity.Evidence;
import com.sunass.regulatorio.domain.enums.ModuleType;
import com.sunass.regulatorio.dto.SurveyRequestDTO;
import com.sunass.regulatorio.dto.SurveyResponseDTO;
import com.sunass.regulatorio.service.SupervisionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/supervision")
@RequiredArgsConstructor
@Tag(name = "Supervisión", description = "Gestión de evaluaciones, encuestas y evidencias")
public class SupervisionController {

    private final SupervisionService supervisionService;

    @PostMapping("/surveys")
    @Operation(summary = "Registrar nueva encuesta de supervisión")
    public ResponseEntity<SurveyResponseDTO> submitSurvey(@Valid @RequestBody SurveyRequestDTO request) {
        return ResponseEntity.ok(supervisionService.submitSurvey(request));
    }

    @GetMapping("/surveys")
    @Operation(summary = "Listar encuestas con filtros opcionales")
    public ResponseEntity<List<SurveyResponseDTO>> getSurveys(
            @RequestParam(required = false) UUID prestadorId,
            @RequestParam(required = false) UUID localityId,
            @RequestParam(required = false) ModuleType module) {
        return ResponseEntity.ok(supervisionService.getSurveys(prestadorId, localityId, module));
    }

    @GetMapping("/surveys/{id}")
    @Operation(summary = "Obtener detalle de encuesta")
    public ResponseEntity<SurveyResponseDTO> getSurveyById(@PathVariable UUID id) {
        return ResponseEntity.ok(supervisionService.getSurveyById(id));
    }

    @PostMapping(value = "/surveys/{surveyId}/evidence", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir evidencia fotográfica a una encuesta")
    public ResponseEntity<Map<String, String>> uploadEvidence(
            @PathVariable UUID surveyId,
            @RequestParam("file") MultipartFile file) throws IOException {
        supervisionService.uploadEvidence(surveyId, file);
        return ResponseEntity.ok(Map.of("message", "Evidencia registrada exitosamente"));
    }

    @GetMapping("/surveys/{surveyId}/evidence")
    @Operation(summary = "Listar evidencias de una encuesta")
    public ResponseEntity<List<Map<String, Object>>> getEvidence(@PathVariable UUID surveyId) {
        return ResponseEntity.ok(supervisionService.getEvidenceBySurvey(surveyId));
    }

    @GetMapping("/evidence/{evidenceId}/download")
    @Operation(summary = "Descargar archivo de evidencia")
    public ResponseEntity<byte[]> downloadEvidence(@PathVariable UUID evidenceId) {
        Evidence evidence = supervisionService.getEvidenceFile(evidenceId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + evidence.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(evidence.getMimeType()))
                .body(evidence.getContent());
    }
}
