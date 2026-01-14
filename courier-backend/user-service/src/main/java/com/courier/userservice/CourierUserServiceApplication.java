package com.courier.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class CourierUserServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(CourierUserServiceApplication.class, args);
  }
}
