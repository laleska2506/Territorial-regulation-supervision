package com.sunass.regulatorio.domain.entity;

import com.sunass.regulatorio.domain.enums.PrestadorType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "prestador", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"prestador_type", "name"})
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Prestador {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "prestador_type", nullable = false, columnDefinition = "prestador_type")
    private PrestadorType prestadorType;

    @Column(nullable = false)
    private String name;

    private String code;

    @Column(length = 20)
    private String ruc;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> attributes;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (isActive == null) isActive = true;
    }
}
