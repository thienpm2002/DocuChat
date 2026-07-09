package com.thienpm.docuchat.storage.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.storage.enums.StorageType;

public interface FileStorageService {
    String store(MultipartFile file, StorageType type);

    void delete(String fileName, StorageType type);

    Resource loadAsResource(String storedName, StorageType type);

    String getContentType(String storedName, StorageType type);
}
