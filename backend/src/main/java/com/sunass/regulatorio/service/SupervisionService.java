package com.sunass.regulatorio.service;

import com.sunass.regulatorio.domain.entity.*;
import com.sunass.regulatorio.domain.enums.GeoStatus;
import com.sunass.regulatorio.domain.enums.ModuleType;
import com.sunass.regulatorio.domain.enums.SyncStatus;
import com.sunass.regulatorio.dto.*;
import com.sunass.regulatorio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupervisionService {

    private final PrestadorRepository prestadorRepository;
    private final LocalityRepository localityRepository;
    private final VisitRepository visitRepository;
    private final SurveyRepository surveyRepository;
    private final EvidenceRepository evidenceRepository;

    @Transactional
    public SurveyResponseDTO submitSurvey(SurveyRequestDTO request) {
        Prestador prestador = prestadorRepository.findById(request.getPrestadorId())
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado: " + request.getPrestadorId()));

        Locality locality = localityRepository.findById(request.getLocalityId())
                .orElseThrow(() -> new RuntimeException("Localidad no encontrada: " + request.getLocalityId()));

        // Create visit
        Visit visit = Visit.builder()
                .prestador(prestador)
                .locality(locality)
                .visitedAt(OffsetDateTime.now())
                .geoStatus(request.getLat() != null ? GeoStatus.CAPTURED : GeoStatus.FAILED)
                .lat(request.getLat())
                .lng(request.getLng())
                .accuracyM(request.getAccuracyM())
                .geoCapturedAt(request.getLat() != null ? OffsetDateTime.now() : null)
                .notes(request.getNotes())
                .syncStatus(SyncStatus.SYNCED)
                .build();
        visit = visitRepository.save(visit);

        // Create survey
        Map<String, Object> payload = new HashMap<>(request.getAnswers());

        Survey survey = Survey.builder()
                .visit(visit)
                .prestador(prestador)
                .locality(locality)
                .module(request.getModule())
                .version(1)
                .payload(payload)
                .answeredAt(OffsetDateTime.now())
                .answeredLat(request.getLat())
                .answeredLng(request.getLng())
                .answeredAccuracyM(request.getAccuracyM())
                .answeredGeoStatus(request.getLat() != null ? GeoStatus.CAPTURED : GeoStatus.FAILED)
                .syncStatus(SyncStatus.SYNCED)
                .build();
        survey = surveyRepository.save(survey);

        return toSurveyResponseDTO(survey);
    }

    public List<SurveyResponseDTO> getSurveys(UUID prestadorId, UUID localityId, ModuleType module) {
        List<Survey> surveys;

        if (prestadorId != null && localityId != null) {
            surveys = surveyRepository.findByPrestadorIdAndLocalityIdOrderByAnsweredAtDesc(prestadorId, localityId);
        } else if (prestadorId != null && module != null) {
            surveys = surveyRepository.findByPrestadorIdAndModuleOrderByAnsweredAtDesc(prestadorId, module);
        } else if (prestadorId != null) {
            surveys = surveyRepository.findByPrestadorIdOrderByAnsweredAtDesc(prestadorId);
        } else {
            surveys = surveyRepository.findAll();
        }

        return surveys.stream()
                .map(this::toSurveyResponseDTO)
                .collect(Collectors.toList());
    }

    public SurveyResponseDTO getSurveyById(UUID surveyId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada: " + surveyId));
        return toSurveyResponseDTO(survey);
    }

    @Transactional
    public void uploadEvidence(UUID surveyId, MultipartFile file) throws IOException {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada: " + surveyId));

        String sha256 = computeSha256(file.getBytes());

        Evidence evidence = Evidence.builder()
                .survey(survey)
                .fileName(file.getOriginalFilename())
                .mimeType(file.getContentType())
                .fileSize(file.getSize())
                .sha256(sha256)
                .content(file.getBytes())
                .syncStatus(SyncStatus.SYNCED)
                .build();

        evidenceRepository.save(evidence);
    }

    public List<Map<String, Object>> getEvidenceBySurvey(UUID surveyId) {
        return evidenceRepository.findBySurveyIdOrderByCreatedAtDesc(surveyId).stream()
                .map(e -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", e.getId());
                    map.put("fileName", e.getFileName());
                    map.put("mimeType", e.getMimeType());
                    map.put("fileSize", e.getFileSize());
                    map.put("createdAt", e.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public Evidence getEvidenceFile(UUID evidenceId) {
        return evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new RuntimeException("Evidencia no encontrada: " + evidenceId));
    }

    private SurveyResponseDTO toSurveyResponseDTO(Survey s) {
        return SurveyResponseDTO.builder()
                .id(s.getId())
                .visitId(s.getVisit().getId())
                .prestadorId(s.getPrestador().getId())
                .prestadorName(s.getPrestador().getName())
                .localityId(s.getLocality().getId())
                .localityName(s.getLocality().getName())
                .module(s.getModule())
                .version(s.getVersion())
                .payload(s.getPayload())
                .answeredAt(s.getAnsweredAt())
                .evidenceCount(evidenceRepository.countBySurveyId(s.getId()))
                .build();
    }

    private String computeSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }
}
