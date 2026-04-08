package com.sunass.regulatorio.domain.entity;

import com.sunass.regulatorio.domain.enums.GeoStatus;
import com.sunass.regulatorio.domain.enums.SyncStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "visit")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prestador_id", nullable = false)
    private Prestador prestador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", nullable = false)
    private Locality locality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "visited_at", nullable = false)
    private OffsetDateTime visitedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "geo_status", nullable = false, columnDefinition = "geo_status")
    private GeoStatus geoStatus;

    private Double lat;
    private Double lng;

    @Column(name = "accuracy_m")
    private Double accuracyM;

    @Column(name = "geo_captured_at")
    private OffsetDateTime geoCapturedAt;

    private String notes;

    @Column(name = "offline_id", unique = true)
    private UUID offlineId;

    @Column(name = "device_id")
    private String deviceId;

    @Enumerated(EnumType.STRING)
    @Column(name = "sync_status", nullable = false, columnDefinition = "sync_status")
    private SyncStatus syncStatus;

    @Column(name = "last_sync_at")
    private OffsetDateTime lastSyncAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (visitedAt == null) visitedAt = OffsetDateTime.now();
        if (geoStatus == null) geoStatus = GeoStatus.FAILED;
        if (syncStatus == null) syncStatus = SyncStatus.SYNCED;
    }
}
