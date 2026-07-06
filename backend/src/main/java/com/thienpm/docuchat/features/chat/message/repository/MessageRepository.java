package com.thienpm.docuchat.features.chat.message.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.thienpm.docuchat.features.chat.message.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByChatSessionId(
            Long chatSessionId,
            Pageable pageable);
}
