package com.sunass.regulatorio.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "prestador_locality")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@IdClass(PrestadorLocality.PrestadorLocalityId.class)
public class PrestadorLocality {

    @Id
    @Column(name = "prestador_id")
    private UUID prestadorId;

    @Id
    @Column(name = "locality_id")
    private UUID localityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prestador_id", insertable = false, updatable = false)
    private Prestador prestador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", insertable = false, updatable = false)
    private Locality locality;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;

    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (isPrimary == null) isPrimary = false;
    }

    @Data
    @NoArgsConstructor @AllArgsConstructor
    public static class PrestadorLocalityId implements Serializable {
        private UUID prestadorId;
        private UUID localityId;
    }
}
