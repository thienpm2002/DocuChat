package com.thienpm.docuchat.security.jwt;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtKeyProvider {

    public SecretKey getAccessKey(String accessSecret) {
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(accessSecret));
    }

    public SecretKey getRefreshKey(String refreshSecret) {
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(refreshSecret));
    }
}
