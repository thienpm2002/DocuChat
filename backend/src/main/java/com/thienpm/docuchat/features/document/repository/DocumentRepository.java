package com.thienpm.docuchat.features.document.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.thienpm.docuchat.features.document.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    Page<Document> findByUserId(Long userId, Pageable pageable);
}
