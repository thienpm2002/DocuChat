package com.thienpm.docuchat.integration.ai;

import java.net.http.HttpClient;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class RestClientConfig {

    private final AiServiceProperties aiServiceProperties;

    @Bean
    public RestClient aiRestClient(RestClient.Builder builder) {

        // FastAPI/Uvicorn has issues with JDK HttpClient HTTP/2 upgrade (h2c)
        // Force HTTP/1.1
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);

        return builder
                .requestFactory(requestFactory)
                .baseUrl(aiServiceProperties.getBaseUrl())
                .build();
    }
}