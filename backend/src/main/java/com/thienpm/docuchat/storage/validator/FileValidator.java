package com.thienpm.docuchat.storage.validator;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FileValidator {

    public String validate(MultipartFile file,
            DataSize maxSize,
            List<String> allowedTypes,
            List<String> allowedExtensions) {

        // validateEmpty
        if (file.isEmpty())
            throw new AppException(ErrorCode.FILE_EMPTY);

        // validateSize
        if (file.getSize() > maxSize.toBytes())
            throw new AppException(ErrorCode.FILE_SIZE_EXCEEDED);

        // validateContentType
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType))
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);

        // validateExtension
        String filename = file.getOriginalFilename();

        String extension = "";

        if (filename != null && filename.contains(".")) {
            extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        }

        if (!allowedExtensions.contains(extension))
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);

        return extension;
    }
}
