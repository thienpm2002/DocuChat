package com.thienpm.docuchat.common.util;

import java.io.IOException;

import com.thienpm.docuchat.common.exception.ErrorCode;

import jakarta.servlet.http.HttpServletResponse;

public class ResponseWriter {

    public static void writeError(HttpServletResponse res, ErrorCode errorCode) throws IOException {

        res.setStatus(errorCode.getStatus().value());
        res.setContentType("application/json");

        String body = String.format("""
                {
                    "code": "%s",
                    "message": "%s"
                }
                """, errorCode.getCode(), errorCode.getMessage());

        res.getWriter().write(body);
    }
}
