package com.sunass.regulatorio.repository;

import com.sunass.regulatorio.domain.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DistrictRepository extends JpaRepository<District, UUID> {
    List<District> findByProvinceIdOrderByNameAsc(UUID provinceId);
}
