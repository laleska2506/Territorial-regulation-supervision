package com.sunass.regulatorio.domain.entity;

import com.sunass.regulatorio.domain.enums.GeoStatus;
import com.sunass.regulatorio.domain.enums.ModuleType;
import com.sunass.regulatorio.domain.enums.SyncStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "survey")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visit_id", nullable = false)
    private Visit visit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prestador_id", nullable = false)
    private Prestador prestador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", nullable = false)
    private Locality locality;

    @Enumerated(EnumType.STRING)
    @Column(name = "module", nullable = false, columnDefinition = "module_type")
    private ModuleType module;

    @Column(nullable = false)
    private Integer version;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> payload;

    @Column(name = "answered_at", nullable = false)
    private OffsetDateTime answeredAt;

    @Column(name = "answered_lat")
    private Double answeredLat;

    @Column(name = "answered_lng")
    private Double answeredLng;

    @Column(name = "answered_accuracy_m")
    private Double answeredAccuracyM;

    @Enumerated(EnumType.STRING)
    @Column(name = "answered_geo_status", nullable = false, columnDefinition = "geo_status")
    private GeoStatus answeredGeoStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "offline_id", unique = true)
    private UUID offlineId;

    @Column(name = "device_id")
    private String deviceId;

    @Enumerated(EnumType.STRING)
    @Column(name = "sync_status", nullable = false, columnDefinition = "sync_status")
    private SyncStatus syncStatus;

    @Column(name = "last_sync_at")
    private OffsetDateTime lastSyncAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by")
    private AppUser submittedBy;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (answeredAt == null) answeredAt = OffsetDateTime.now();
        if (version == null) version = 1;
        if (answeredGeoStatus == null) answeredGeoStatus = GeoStatus.FAILED;
        if (syncStatus == null) syncStatus = SyncStatus.SYNCED;
    }
}
