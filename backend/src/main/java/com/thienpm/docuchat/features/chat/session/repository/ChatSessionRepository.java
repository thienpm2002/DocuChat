package com.thienpm.docuchat.features.chat.session.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thienpm.docuchat.features.chat.session.dto.response.ChatSessionResponse;
import com.thienpm.docuchat.features.chat.session.entity.ChatSession;
import com.thienpm.docuchat.features.document.entity.Document;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    @Query("""
            SELECT new com.thienpm.docuchat.features.chat.session.dto.response.ChatSessionResponse(
                cs.id,
                cs.title,
                cs.document.id
            )
            FROM ChatSession cs
            WHERE cs.user.id = :userId
            """)
    Page<ChatSessionResponse> findChatSessionsByUserId(Long userId, Pageable pageable);

    Optional<ChatSession> findByDocument(Document document);

    Long countByUserId(Long userId);
}
