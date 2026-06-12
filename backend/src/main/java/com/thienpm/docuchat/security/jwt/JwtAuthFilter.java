package com.thienpm.docuchat.security.jwt;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.common.util.ResponseWriter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws IOException, ServletException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            try {
                String accessToken = authHeader.substring(7);

                Claims claims = jwtService.verifyAccessToken(accessToken);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        Long.valueOf(claims.getSubject()),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("role", String.class))));

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (ExpiredJwtException e) {
                ResponseWriter.writeError(response, ErrorCode.TOKEN_EXPIRED);
                return;
            } catch (JwtException e) {
                ResponseWriter.writeError(response, ErrorCode.TOKEN_INVALID);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}