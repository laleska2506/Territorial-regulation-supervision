package com.sunass.regulatorio.repository;

import com.sunass.regulatorio.domain.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VisitRepository extends JpaRepository<Visit, UUID> {
    List<Visit> findByPrestadorIdAndLocalityIdOrderByVisitedAtDesc(UUID prestadorId, UUID localityId);
    List<Visit> findByPrestadorIdOrderByVisitedAtDesc(UUID prestadorId);
}
