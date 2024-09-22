package com.david.maman.authenticationserver.services;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.david.maman.authenticationserver.models.entities.User;

@FeignClient(name = "token-server")
public interface TokenFeignClient {

    @PostMapping("/api/token/build-token")
    String buildToken(@RequestBody User user, @RequestParam("expiresIn") long expiresIn);

}
