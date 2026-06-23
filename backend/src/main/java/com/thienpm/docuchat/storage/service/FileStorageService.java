package com.thienpm.docuchat.storage.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String store(MultipartFile file);

    void delete(String fileName);

    Resource loadAsResource(String storedName);
}
