package com.sunass.regulatorio.repository;

import com.sunass.regulatorio.domain.entity.Prestador;
import com.sunass.regulatorio.domain.enums.PrestadorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrestadorRepository extends JpaRepository<Prestador, UUID> {

    List<Prestador> findByPrestadorType(PrestadorType type);

    List<Prestador> findByIsActiveTrue();

    @Query("SELECT DISTINCT p FROM Prestador p JOIN PrestadorLocality pl ON p.id = pl.prestadorId " +
           "WHERE pl.localityId = :localityId")
    List<Prestador> findByLocalityId(@Param("localityId") UUID localityId);

    @Query("SELECT DISTINCT p FROM Prestador p JOIN PrestadorLocality pl ON p.id = pl.prestadorId " +
           "JOIN Locality l ON pl.localityId = l.id " +
           "WHERE l.district.id = :districtId")
    List<Prestador> findByDistrictId(@Param("districtId") UUID districtId);

    @Query("SELECT p FROM Prestador p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Prestador> searchByName(@Param("search") String search);
}
