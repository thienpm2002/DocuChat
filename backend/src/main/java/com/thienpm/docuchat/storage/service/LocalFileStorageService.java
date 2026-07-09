package com.thienpm.docuchat.storage.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.storage.config.AvatarProperties;
import com.thienpm.docuchat.storage.config.FileProperties;
import com.thienpm.docuchat.storage.enums.StorageType;
import com.thienpm.docuchat.storage.validator.FileValidator;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocalFileStorageService implements FileStorageService {
    private final FileProperties fileProperties;
    private final AvatarProperties avatarProperties;
    private final FileValidator fileValidator;

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(fileProperties.uploadDir()));
        Files.createDirectories(Paths.get(avatarProperties.uploadDir()));
    }

    @Override
    public String store(MultipartFile file, StorageType type) {
        // Validate
        String extension = validate(file, type);

        try {
            // Tạo storedName
            String storedName = UUID.randomUUID() + "." + extension;

            // Copy file vào local
            Path target = getRootLocation(type).resolve(storedName);
            Files.copy(file.getInputStream(), target);

            return storedName;
        } catch (IOException e) {
            // Lỗi UUID trùng
            throw new AppException(ErrorCode.FILE_STORAGE_ERROR);
        }
    }

    @Override
    public void delete(String storedName, StorageType type) {
        try {
            Path file = getRootLocation(type).resolve(storedName);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_DELETE_ERROR);
        }
    }

    @Override
    public Resource loadAsResource(String storedName, StorageType type) {
        try {
            Path file = getRootLocation(type).resolve(storedName);

            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            }

            throw new AppException(ErrorCode.STORAGE_FILE_NOT_FOUND);

        } catch (MalformedURLException e) {
            throw new AppException(ErrorCode.STORAGE_FILE_NOT_FOUND);
        }
    }

    private Path getRootLocation(StorageType type) {
        return switch (type) {
            case DOCUMENT -> Paths.get(fileProperties.uploadDir());
            case AVATAR -> Paths.get(avatarProperties.uploadDir());
        };
    }

    private String validate(MultipartFile file, StorageType type) {
        return switch (type) {
            case DOCUMENT -> fileValidator.validate(file,
                    fileProperties.maxSize(),
                    fileProperties.allowedTypes(),
                    fileProperties.allowedExtensions());

            case AVATAR -> fileValidator.validate(file,
                    avatarProperties.maxSize(),
                    avatarProperties.allowedTypes(),
                    avatarProperties.allowedExtensions());
        };
    }

    @Override
    public String getContentType(String storedName, StorageType type) {
        try {
            Path file = getRootLocation(type).resolve(storedName);

            String contentType = Files.probeContentType(file);

            return contentType != null
                    ? contentType
                    : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        } catch (IOException e) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }

}
