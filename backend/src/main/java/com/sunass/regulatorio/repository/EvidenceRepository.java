package com.sunass.regulatorio.repository;

import com.sunass.regulatorio.domain.entity.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, UUID> {
    List<Evidence> findBySurveyIdOrderByCreatedAtDesc(UUID surveyId);
    long countBySurveyId(UUID surveyId);
}
