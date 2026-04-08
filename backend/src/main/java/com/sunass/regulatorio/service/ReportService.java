package com.sunass.regulatorio.service;

import com.sunass.regulatorio.domain.entity.Prestador;
import com.sunass.regulatorio.domain.entity.Survey;
import com.sunass.regulatorio.dto.DirectReportRequestDTO;
import com.sunass.regulatorio.dto.ReportRequestDTO;
import com.sunass.regulatorio.dto.ReportResponseDTO;
import com.sunass.regulatorio.repository.EvidenceRepository;
import com.sunass.regulatorio.repository.PrestadorRepository;
import com.sunass.regulatorio.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final SurveyRepository surveyRepository;
    private final PrestadorRepository prestadorRepository;
    private final EvidenceRepository evidenceRepository;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String geminiModel;

    private static final String GEMINI_BASE_URL = "https://generativelanguage.googleapis.com";

    public ReportResponseDTO generateReport(ReportRequestDTO request) {
        Survey survey = surveyRepository.findById(request.getSurveyId())
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada: " + request.getSurveyId()));

        Prestador prestador = survey.getPrestador();
        long photoCount = evidenceRepository.countBySurveyId(survey.getId());

        // Build findings from the survey payload
        Map<String, Object> payload = survey.getPayload();
        StringBuilder findings = new StringBuilder();

        payload.forEach((key, value) -> {
            String status = String.valueOf(value);
            if ("NO".equalsIgnoreCase(status)) {
                findings.append("- INCUMPLIMIENTO: Pregunta ").append(key).append(" - Respuesta: NO\n");
            } else if ("SI".equalsIgnoreCase(status)) {
                findings.append("- CUMPLE: Pregunta ").append(key).append(" - Respuesta: SÍ\n");
            }
        });

        if (findings.isEmpty()) {
            findings.append("No se han registrado hallazgos aún.");
        }

        String prompt = String.format("""
            Actúa como un experto especialista en regulación de saneamiento de la Sunass \
            (Superintendencia Nacional de Servicios de Saneamiento del Perú).
            Estás redactando un "Informe de Supervisión Regulatoria" para un Prestador de Servicios de Saneamiento.
            
            DATOS DEL PRESTADOR:
            Nombre: %s
            Tipo: %s
            
            HALLAZGOS DE LA SUPERVISIÓN:
            %s
            
            EVIDENCIA ADJUNTA:
            Se han adjuntado %d fotografías como evidencia técnica del estado de la infraestructura \
            y cumplimiento de protocolos.
            
            INSTRUCCIONES:
            Genera un informe técnico con las siguientes secciones:
            1. **Resumen Ejecutivo**: Resumen breve de la situación encontrada.
            2. **Hallazgos Críticos**: Lista los problemas sistémicos o incumplimientos detectados. \
            Menciona los artículos del Reglamento de Calidad de la Prestación de Servicios de Saneamiento \
            en Pequeñas Ciudades (RCPSSPC) si aplica.
            3. **Recomendaciones Técnicas**: 3 a 5 recomendaciones técnicas inmediatas y obligatorias \
            para subsanar las observaciones.
            
            Tono: Formal, técnico y regulatorio.
            Formato: Markdown limpio.
            """,
                prestador.getName(),
                prestador.getPrestadorType().name(),
                findings.toString(),
                photoCount
        );

        String reportMarkdown = callGeminiApi(prompt);

        return ReportResponseDTO.builder()
                .reportMarkdown(reportMarkdown)
                .surveyId(survey.getId().toString())
                .prestadorName(prestador.getName())
                .module(survey.getModule().name())
                .build();
    }

    /**
     * Generate a report directly from frontend data (no persisted survey needed).
     */
    public ReportResponseDTO generateDirectReport(DirectReportRequestDTO request) {
        StringBuilder findings = new StringBuilder();

        if (request.getAnswers() != null) {
            request.getAnswers().forEach((key, value) -> {
                if ("NO".equalsIgnoreCase(value)) {
                    findings.append("- INCUMPLIMIENTO: ").append(key).append(" - Respuesta: NO\n");
                } else if ("SI".equalsIgnoreCase(value)) {
                    findings.append("- CUMPLE: ").append(key).append(" - Respuesta: SÍ\n");
                }
            });
        }

        if (findings.isEmpty()) {
            findings.append("No se han registrado hallazgos aún.");
        }

        String locationInfo = request.getLocation() != null ? "\nUbicación: " + request.getLocation() : "";

        String prompt = String.format("""
            Actúa como un experto especialista en regulación de saneamiento de la Sunass \
            (Superintendencia Nacional de Servicios de Saneamiento del Perú).
            Estás redactando un "Informe de Supervisión Regulatoria" para un Prestador de Servicios de Saneamiento.
            
            DATOS DEL PRESTADOR:
            Nombre: %s
            Tipo: %s%s
            
            HALLAZGOS DE LA SUPERVISIÓN:
            %s
            
            EVIDENCIA ADJUNTA:
            Se han adjuntado %d fotografías como evidencia técnica del estado de la infraestructura \
            y cumplimiento de protocolos.
            
            INSTRUCCIONES:
            Genera un informe técnico con las siguientes secciones:
            1. **Resumen Ejecutivo**: Resumen breve de la situación encontrada.
            2. **Hallazgos Críticos**: Lista los problemas sistémicos o incumplimientos detectados. \
            Menciona los artículos del Reglamento de Calidad de la Prestación de Servicios de Saneamiento \
            en Pequeñas Ciudades (RCPSSPC) si aplica.
            3. **Recomendaciones Técnicas**: 3 a 5 recomendaciones técnicas inmediatas y obligatorias \
            para subsanar las observaciones.
            
            Tono: Formal, técnico y regulatorio.
            Formato: Markdown limpio.
            """,
                request.getProviderName(),
                request.getProviderType(),
                locationInfo,
                findings.toString(),
                request.getPhotoCount()
        );

        String reportMarkdown = callGeminiApi(prompt);

        return ReportResponseDTO.builder()
                .reportMarkdown(reportMarkdown)
                .prestadorName(request.getProviderName())
                .module(request.getProviderType())
                .build();
    }

    private String callGeminiApi(String prompt) {
        try {
            WebClient webClient = WebClient.builder()
                    .baseUrl(GEMINI_BASE_URL)
                    .build();

            String url = String.format("/v1beta/models/%s:generateContent?key=%s", geminiModel, geminiApiKey);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            Map<String, Object> response = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }

            return "No se pudo generar el informe. Respuesta vacía del servicio de IA.";

        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return "Error al conectar con el motor de análisis IA: " + e.getMessage();
        }
    }
}
