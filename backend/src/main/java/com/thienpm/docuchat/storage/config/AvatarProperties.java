package com.thienpm.docuchat.storage.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.unit.DataSize;

@ConfigurationProperties(prefix = "app.avatar")
public record AvatarProperties(
        String uploadDir,
        DataSize maxSize,
        List<String> allowedTypes,
        List<String> allowedExtensions) {
}
