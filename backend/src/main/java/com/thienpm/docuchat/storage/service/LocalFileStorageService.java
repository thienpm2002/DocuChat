package com.thienpm.docuchat.storage.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.storage.config.FileProperties;
import com.thienpm.docuchat.storage.validator.FileValidator;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocalFileStorageService implements FileStorageService {
    private final FileProperties properties;
    private final FileValidator fileValidator;
    private Path rootLocation;

    @PostConstruct
    public void init() throws IOException {

        rootLocation = Paths.get(properties.uploadDir());

        Files.createDirectories(rootLocation);
    }

    @Override
    public String store(MultipartFile file) {
        // Validate
        String extension = fileValidator.validate(file);

        try {
            // Tạo storedName
            String storedName = UUID.randomUUID() + "." + extension;

            // Copy file vào local
            Path target = rootLocation.resolve(storedName);
            Files.copy(file.getInputStream(), target);

            return storedName;
        } catch (Exception e) {
            // Lỗi UUID trùng
            throw new AppException(ErrorCode.FILE_STORAGE_ERROR);
        }
    }

    @Override
    public void delete(String storedName) {
        try {
            Path file = rootLocation.resolve(storedName);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_DELETE_ERROR);
        }
    }

    @Override
    public Resource loadAsResource(String storedName) {
        try {
            Path file = rootLocation.resolve(storedName);

            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            }

            throw new AppException(ErrorCode.DOCUMENT_NOT_FOUND);

        } catch (MalformedURLException e) {
            throw new AppException(ErrorCode.DOCUMENT_NOT_FOUND);
        }
    }

}
