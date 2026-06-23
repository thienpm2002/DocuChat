package com.thienpm.docuchat.integration.ai;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.thienpm.docuchat.integration.ai.dto.request.ProcessDocumentRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiClient {
    private final RestClient aiRestClient;

    public void processDocument(ProcessDocumentRequest request) {
        aiRestClient.post()
                .uri("/documents/process")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    public void deleteDocument(Long documentId) {
        aiRestClient.delete()
                .uri("/documents/" + documentId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toBodilessEntity();
    }

}
