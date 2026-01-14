package com.courier.authservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.courier.authservice.objects.dto.UserDto;

@FeignClient(name = "courier-user-service")
public interface UserServiceClient {

  @GetMapping("/api/user/find-by-email-or-phone")
  UserDto getUserByEmailOrPhone(
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String phoneNumber,
      @RequestHeader("X-Api-Key") String apiKey);
}
