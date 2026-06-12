package com.thienpm.docuchat.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {
    private String accessSecret;
    private String refreshSecret;
    private Long accessExpiration;
    private Long refreshExpiration;
}
