package com.david.maman.courierserver.services.impl;

import java.security.PublicKey;
import java.util.Date;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.services.JwtService;
import com.david.maman.courierserver.services.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JwtServiceImpl implements JwtService{

    public PublicKey jwtPublicKey;

    @Autowired
    private UserService userService;

    private volatile boolean isPublicKeyAvailable = false;

    @Override
    public void setPublicKey(PublicKey publicKey){
        this.jwtPublicKey = publicKey;
        this.isPublicKeyAvailable = true;
    }

    @Override
    public Boolean isPublicKeyAvailable(){
        return this.isPublicKeyAvailable;
    }

    @Override
    public void setPublicKeyFlag(Boolean flag){
        this.isPublicKeyAvailable = flag;
    }

    @Override
    public Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(this.jwtPublicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @Override
    public Boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    @Override
    public User getUserFromToken(String token){
        Claims claims = extractAllClaims(token);
        String phone = claims.get("phone", String.class);
        String email = claims.get("email", String.class);

        return userService.loadUserByEmailAndPhone(email, phone).orElse(null);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private  Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

}
