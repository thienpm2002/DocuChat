package com.thienpm.docuchat.features.document.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thienpm.docuchat.features.document.dto.DocumentResponse;
import com.thienpm.docuchat.features.document.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Query("""
            SELECT new com.thienpm.docuchat.features.document.dto.DocumentResponse(
                d.id,
                d.originalName,
                d.fileSize,
                d.status,
                d.createdAt,
                cs.id
            )
            FROM Document d
            LEFT JOIN ChatSession cs ON cs.document = d
            WHERE d.user.id = :userId
            """)
    Page<DocumentResponse> findDocumentsByUserId(Long userId, Pageable pageable);
}
