package com.sunass.regulatorio.repository;

import com.sunass.regulatorio.domain.entity.Locality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, UUID> {
    List<Locality> findByDistrictIdOrderByNameAsc(UUID districtId);
    Optional<Locality> findByUbigeo(String ubigeo);
}
