package com.thienpm.docuchat.integration.ai;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "app.ai-service")
@Getter
@Setter
public class AiServiceProperties {

    private String baseUrl;

}