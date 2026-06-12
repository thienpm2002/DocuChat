package com.thienpm.docuchat.security.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.thienpm.docuchat.config.properties.JwtProperties;
import com.thienpm.docuchat.features.user.entity.User;
import com.thienpm.docuchat.security.custom.CustomUserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JwtService {
    private final JwtProperties jwtProperties;

    private final SecretKey accessKey;
    private final SecretKey refreshKey;

    public JwtService(JwtProperties jwtProperties, JwtKeyProvider jwtKeyProvider) {
        this.jwtProperties = jwtProperties;
        this.accessKey = jwtKeyProvider.getAccessKey(jwtProperties.getAccessSecret());
        this.refreshKey = jwtKeyProvider.getRefreshKey(jwtProperties.getRefreshSecret());
    }

    private String generateToken(UserDetails userDetails, SecretKey key, Long expiration) {

        User user = ((CustomUserDetails) userDetails).getUser();

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("role", user.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public String generateAccessToken(UserDetails userDetails) {

        return generateToken(userDetails, accessKey,
                jwtProperties.getAccessExpiration());

    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, refreshKey,
                jwtProperties.getRefreshExpiration());
    }

    private Claims getClaims(String token, SecretKey key) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Claims verifyAccessToken(String accessToken) {
        return getClaims(accessToken, accessKey);
    }

    public Claims verifyRefreshToken(String refreshToken) {
        return getClaims(refreshToken, refreshKey);
    }

}
