package com.sunass.regulatorio.domain.entity;

import com.sunass.regulatorio.domain.enums.ModuleType;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "module_catalog")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ModuleCatalog {

    @Id
    @Enumerated(EnumType.STRING)
    @Column(name = "module", columnDefinition = "module_type")
    private ModuleType module;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
