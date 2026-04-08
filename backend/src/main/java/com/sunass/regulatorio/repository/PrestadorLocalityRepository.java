package com.sunass.regulatorio.repository;

import com.sunass.regulatorio.domain.entity.PrestadorLocality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrestadorLocalityRepository extends JpaRepository<PrestadorLocality, PrestadorLocality.PrestadorLocalityId> {
    List<PrestadorLocality> findByPrestadorId(UUID prestadorId);
    List<PrestadorLocality> findByLocalityId(UUID localityId);
}
