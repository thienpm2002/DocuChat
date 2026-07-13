package com.thienpm.docuchat.filter;

import java.io.IOException;
import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId);

        long start = System.nanoTime();

        String method = request.getMethod();
        String uri = request.getRequestURI();

        log.info("--> {} {}", method, uri);

        try {
            filterChain.doFilter(request, response);
        } finally {

            long duration = (System.nanoTime() - start) / 1_000_000;

            log.info(
                    "<-- {} {} status={} duration={}ms",
                    method,
                    uri,
                    response.getStatus(),
                    duration);

            MDC.clear();
        }
    }

}
