package com.thienpm.docuchat.storage.validator;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.storage.config.FileProperties;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FileValidator {
    private final FileProperties fileProperties;

    public String validate(MultipartFile file) {

        // validateEmpty
        if (file.isEmpty())
            throw new AppException(ErrorCode.FILE_EMPTY);

        // validateSize
        if (file.getSize() > fileProperties.maxSize().toBytes())
            throw new AppException(ErrorCode.FILE_SIZE_EXCEEDED);

        // validateContentType
        String contentType = file.getContentType();
        if (contentType == null || !fileProperties.allowedTypes().contains(contentType))
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);

        // validateExtension
        String filename = file.getOriginalFilename();

        String extension = "";

        if (filename != null && filename.contains(".")) {
            extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        }

        if (!fileProperties.allowedExtensions().contains(extension))
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);

        return extension;
    }
}
