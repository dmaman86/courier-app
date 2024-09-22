package com.token_server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.token_server.models.entities.User;
import com.token_server.services.JwtService;

@RestController
@RequestMapping("/api/token")
public class TokenController {

    @Autowired
    private JwtService jwtService;

    @PostMapping("/build-token")
    public ResponseEntity<String> buildToken(@RequestBody User user, @RequestParam("expiresIn") long expiresIn) {
        String token = jwtService.buildToken(user, expiresIn);
        return ResponseEntity.ok(token);
    }
}
