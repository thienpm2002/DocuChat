package com.thienpm.docuchat.storage.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thienpm.docuchat.storage.enums.StorageType;
import com.thienpm.docuchat.storage.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
public class StorageController {
    private final FileStorageService fileStorageService;

    @GetMapping("/avatars/{filename}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String filename) {

        Resource avatar = fileStorageService.loadAsResource(filename, StorageType.AVATAR);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        fileStorageService.getContentType(filename, StorageType.AVATAR)))
                .body(avatar);
    }
}
