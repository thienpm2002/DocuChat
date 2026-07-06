package com.thienpm.docuchat.integration.ai;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.function.Consumer;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.thienpm.docuchat.integration.ai.dto.request.ChatRequest;
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

    public void streamChat(
            ChatRequest request,
            Consumer<String> lineConsumer) {

        aiRestClient.post()
                .uri("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.TEXT_EVENT_STREAM)
                .body(request)
                .exchange((clientRequest, clientResponse) -> {

                    if (!clientResponse.getStatusCode().is2xxSuccessful()) {
                        throw new RuntimeException(
                                "AI service returned: " + clientResponse.getStatusCode());
                    }

                    try (BufferedReader reader = new BufferedReader(
                            new InputStreamReader(
                                    clientResponse.getBody(),
                                    StandardCharsets.UTF_8))) {

                        String line;

                        while ((line = reader.readLine()) != null) {

                            lineConsumer.accept(line);

                        }

                    } catch (IOException e) {

                        throw new RuntimeException("Failed to read AI stream.", e);

                    }

                    return null;
                });
    }

}
