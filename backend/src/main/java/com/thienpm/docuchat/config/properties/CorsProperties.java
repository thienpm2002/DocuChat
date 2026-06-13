package com.thienpm.docuchat.config.properties;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "app.cors")
@Getter
@Setter
public class CorsProperties {
    private List<String> allowedOrigins;
}
