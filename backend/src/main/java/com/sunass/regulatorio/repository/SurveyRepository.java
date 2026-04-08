package com.sunass.regulatorio.repository;

import com.sunass.regulatorio.domain.entity.Survey;
import com.sunass.regulatorio.domain.enums.ModuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, UUID> {

    List<Survey> findByVisitIdOrderByAnsweredAtDesc(UUID visitId);

    List<Survey> findByPrestadorIdOrderByAnsweredAtDesc(UUID prestadorId);

    List<Survey> findByPrestadorIdAndLocalityIdOrderByAnsweredAtDesc(UUID prestadorId, UUID localityId);

    List<Survey> findByPrestadorIdAndModuleOrderByAnsweredAtDesc(UUID prestadorId, ModuleType module);

    @Query("SELECT s FROM Survey s WHERE s.prestador.id = :prestadorId " +
           "AND s.locality.id = :localityId AND s.module = :module " +
           "ORDER BY s.answeredAt DESC")
    List<Survey> findLastByPrestadorLocalityModule(
            @Param("prestadorId") UUID prestadorId,
            @Param("localityId") UUID localityId,
            @Param("module") ModuleType module);

    default Optional<Survey> findLatestByPrestadorLocalityModule(UUID prestadorId, UUID localityId, ModuleType module) {
        List<Survey> results = findLastByPrestadorLocalityModule(prestadorId, localityId, module);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
}
