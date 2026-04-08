package com.sunass.regulatorio.repository;

import com.sunass.regulatorio.domain.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, UUID> {
    List<Province> findAllByOrderByNameAsc();
    List<Province> findByDepartmentIdOrderByNameAsc(UUID departmentId);
}
