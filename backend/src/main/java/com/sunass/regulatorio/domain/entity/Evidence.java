package com.sunass.regulatorio.domain.entity;

import com.sunass.regulatorio.domain.enums.SyncStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "evidence")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "mime_type", nullable = false)
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    private String sha256;

    @Column(name = "taken_at")
    private OffsetDateTime takenAt;

    @Column(columnDefinition = "bytea")
    private byte[] content;

    @Column(name = "storage_url")
    private String storageUrl;

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

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (syncStatus == null) syncStatus = SyncStatus.SYNCED;
    }
}
